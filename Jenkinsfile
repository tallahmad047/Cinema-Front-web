pipeline {
    agent any

    environment {
        APP_VERSION = ''
    }

    stages {
        stage('Cloner le projet') {
            steps {
                git credentialsId: 'github-creds', url: 'https://github.com/tallahmad047/Cinema-Front-web.git'
            }
        }

        stage('Générer version et tag') {
            steps {
                script {
                    def lastTag = sh(script: 'git describe --tags --abbrev=0 || echo "v0.0.0"', returnStdout: true).trim()
                    def baseVersion = lastTag.startsWith('v') ? lastTag.substring(1) : lastTag
                    def versionParts = baseVersion.split('\\.')

                    def major = versionParts[0].toInteger()
                    def minor = versionParts[1].toInteger()
                    def patch = versionParts[2].toInteger()

                    if (env.BRANCH_NAME == 'master') {
                        patch += 1
                    } else if (env.BRANCH_NAME == 'devs') {
                        minor += 1
                        patch = 0
                    } else {
                        patch += 1
                    }

                    def newVersion = "${major}.${minor}.${patch}"
                    def newTag = "v${newVersion}"

                    withCredentials([usernamePassword(credentialsId: 'github-creds', usernameVariable: 'GITHUB_USER', passwordVariable: 'GITHUB_TOKEN')]) {
                        sh "git config user.email 'tallahmad047@gmail.com'"
                        sh "git config user.name 'tallahmad047'"
                        sh "git tag ${newTag}"
                        sh "git push https://${GITHUB_USER}:${GITHUB_TOKEN}@github.com/tallahmad047/Cinema-Front-web.git ${newTag}"
                    }

                    echo "📌 Nouveau tag généré : ${newTag}"
                }
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
