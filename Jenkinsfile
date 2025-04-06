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
                    
                    // Configure git user
                    sh "git config user.email 'tallahmad047@gmail.com'"
                    sh "git config user.name 'tallahmad047'"
                    sh "git tag ${newTag}"
                    
                    // Use a more secure approach for pushing
                    withCredentials([usernamePassword(credentialsId: 'github-creds', usernameVariable: 'GITHUB_USER', passwordVariable: 'GITHUB_TOKEN')]) {
                        // Use credentials helper to avoid exposing token in logs
                        sh 'git config credential.helper "!f() { echo username=\\$GITHUB_USER; echo password=\\$GITHUB_TOKEN; }; f"'
                        sh "git push origin ${newTag}"
                    }
                    echo "📌 Nouveau tag généré : ${newTag}"
                }
            }
        }
      stage('Update Version File') {
    steps {
        script {
            // Définir le chemin complet du fichier version.txt
            def versionFile = 'src/version.txt'
            
            // S'assurer que APP_VERSION est défini et retirer le préfixe 'v' si présent
            if (!APP_VERSION) {
                APP_VERSION = env.newTag ? env.newTag.replaceFirst('^v', '') : "0.0.0"
            } else if (APP_VERSION.startsWith('v')) {
                APP_VERSION = APP_VERSION.substring(1)
            }
            
            // Formater la date au format JJ/MM/AAAA
            def today = new Date()
            def formattedDate = today.format('dd/MM/yyyy')
            
            // Créer le contenu avec le format exact souhaité
            def versionContent = """Version: ${APP_VERSION}
Branch: ${env.BRANCH_NAME ?: 'devs'}
Build: ${BUILD_NUMBER}
Date: ${formattedDate}"""
            
            // Écrire dans le fichier
            writeFile file: versionFile, text: versionContent
            
            // Configurer git si nécessaire
            sh "git config user.email 'tallahmad047@gmail.com'"
            sh "git config user.name 'tallahmad047'"
            
            // Ajouter, committer et pousser les changements
            sh "git add ${versionFile}"
            sh "git commit -m 'Mise à jour de version.txt pour build ${BUILD_NUMBER}' || echo 'Pas de changement à committer'"
            
            // Utiliser la même méthode d'authentification que pour le tag
            withCredentials([usernamePassword(credentialsId: 'github-creds', usernameVariable: 'GITHUB_USER', passwordVariable: 'GITHUB_TOKEN')]) {
                sh 'git config credential.helper "!f() { echo username=\\$GITHUB_USER; echo password=\\$GITHUB_TOKEN; }; f"'
                sh "git push origin HEAD:${env.BRANCH_NAME ?: 'devs'}"
            }
            
            echo "Fichier ${versionFile} mis à jour et poussé avec le format requis."
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
