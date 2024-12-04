const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const { ObjectId, MongoClient } = require('mongodb');

// Use your MongoDB server's IP or hostname and database name
const uri = "mongodb://10.0.74.223:27017/crud-nodejs";

app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // Exit the application on connection failure
  }

  const db = client.db('crud-nodejs'); // Ensure this matches your database name
  console.log('Connected to MongoDB');

  // Start the Express server
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });

  // Template engine
  app.set('view engine', 'ejs');

  // Routes
  app.route('/')
    .get((req, res) => {
      db.collection('data').find().toArray((err, results) => {
        if (err) return res.send(err);
        res.render('index.ejs', { data: results });
      });
    })
    .post((req, res) => {
      db.collection('data').insertOne(req.body, (err) => {
        if (err) return res.send(err);
        console.log('Document saved to database');
        res.redirect('/show');
      });
    });

  app.route('/show')
    .get((req, res) => {
      db.collection('data').find().toArray((err, results) => {
        if (err) return res.send(err);
        res.render('show.ejs', { data: results });
      });
    });

  app.route('/edit/:id')
    .get((req, res) => {
      const id = req.params.id;
      db.collection('data').findOne({ _id: ObjectId(id) }, (err, result) => {
        if (err) return res.send(err);
        res.render('edit.ejs', { data: result });
      });
    })
    .post((req, res) => {
      const id = req.params.id;
      const { name, surname } = req.body;
      db.collection('data').updateOne(
        { _id: ObjectId(id) },
        { $set: { name, surname } },
        (err) => {
          if (err) return res.send(err);
          console.log('Document updated in the database');
          res.redirect('/show');
        }
      );
    });

  app.route('/delete/:id')
    .get((req, res) => {
      const id = req.params.id;
      db.collection('data').deleteOne({ _id: ObjectId(id) }, (err) => {
        if (err) return res.status(500).send(err);
        console.log('Document deleted from the database');
        res.redirect('/show');
      });
    });
});
