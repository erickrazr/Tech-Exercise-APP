terraform {
 backend "s3" {
   bucket         = "te-env-lab"
   key            = "state/terraform.tfstate"
   region         = "us-east-1"
   encrypt        = false
 }
}
