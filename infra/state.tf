terraform {
 backend "s3" {
   bucket         = ""te-env-lab
   key            = "tfplan"
   region         = "us-east-1"
   encrypt        = false
 }
}
