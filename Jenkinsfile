pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-cred')
        IMAGE_NAME = 'barathj09/aurastore'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Building Docker image..."
                    dockerImage = docker.build("${IMAGE_NAME}:${IMAGE_TAG}", "-f Dockerfile .")
                }
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-cred') {
                        echo "Pushing tagged image version ${IMAGE_TAG}..."
                        dockerImage.push("${IMAGE_TAG}")

                        echo "Pushing latest tag..."
                        dockerImage.push("latest")
                    }
                }
            }
        }

        stage('Cleanup Local Images') {
            steps {
                bat "docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || exit 0"
            }
        }
    }

    post {
        success {
            echo "CI Pipeline completed successfully! Image pushed to Docker Hub."
        }
        failure {
            echo "Pipeline failed. Check build logs for details."
        }
    }
}