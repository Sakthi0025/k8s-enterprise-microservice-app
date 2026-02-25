pipeline {
    agent any

    environment {
        // Change these appropriately for your environment
        DOCKER_REGISTRY = 'startupdemo'
        KUBECONFIG = credentials('k3s-kubeconfig')
    }

    stages {
        stage('Build Backend') {
            steps {
                dir('backend') {
                    script {
                        docker.build("${DOCKER_REGISTRY}/backend:latest")
                    }
                }
            }
        }
        
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    script {
                        docker.build("${DOCKER_REGISTRY}/frontend:latest")
                    }
                }
            }
        }
        
        stage('Deploy to K3s') {
            steps {
                // Requires the 'Kubernetes CLI' Plugin in Jenkins
                withKubeConfig([credentialsId: 'k3s-kubeconfig', serverUrl: '']) {
                    sh 'kubectl apply -f k8s/postgres.yaml'
                    sh 'kubectl apply -f k8s/backend.yaml'
                    sh 'kubectl apply -f k8s/frontend.yaml'
                    sh 'kubectl apply -f k8s/ingress.yaml'
                    
                    // Restart deployments to pick up new images
                    sh 'kubectl rollout restart deployment backend'
                    sh 'kubectl rollout restart deployment frontend'
                }
            }
        }
    }
}
