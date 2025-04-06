pipeline {
    agent any

    stages {
        stage('Cloner le projet') {
            steps {
                git url: 'https://github.com/tallahmad047/Cinema-Front-web.git'
            }
        }

        stage('Installer les dépendances') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }

    post {
        success {
            echo '✅ Build terminé avec succès.'
        }
        failure {
            echo '❌ Le build a échoué.'
        }
    }
}
