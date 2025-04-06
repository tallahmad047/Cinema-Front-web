pipeline {
    agent any

    environment {
        APP_VERSION = ''
    }

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

                    APP_VERSION = "${major}.${minor}.${patch}"
                    def newTag = "v${APP_VERSION}"

                    sh "git config user.email 'jenkins@example.com'"
                    sh "git config user.name 'Jenkins CI'"

                    sh "git tag ${newTag}"
                    sh "git push origin ${newTag}"

                    echo "📌 Nouveau tag généré : ${newTag}"
                }
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
