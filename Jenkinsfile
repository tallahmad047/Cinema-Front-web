pipeline {
    agent any
    environment {
        APP_VERSION = ''
        NEW_TAG = ''
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
                    
                    // Vérifier si le tag existe déjà
                    def tagExists = sh(script: "git tag -l ${newTag}", returnStdout: true).trim()
                    
                    if (tagExists == newTag) {
                        echo "⚠️ Le tag ${newTag} existe déjà. Incrémentation supplémentaire du numéro de patch."
                        patch += 1
                        newVersion = "${major}.${minor}.${patch}"
                        newTag = "v${newVersion}"
                    }
                    
                    // Créer le tag 
                    sh "git tag ${newTag}"
                    
                    // IMPORTANT: Stocker les valeurs dans des fichiers temporaires pour les transmettre entre les étapes
                    // Ces fichiers sont lus dans les autres étapes pour garantir la cohérence
                    writeFile file: 'app_version.txt', text: newVersion
                    writeFile file: 'new_tag.txt', text: newTag
                    
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
            // Lire la version depuis le fichier temporaire créé précédemment
            def appVersion = readFile('app_version.txt').trim()
            def newTag = readFile('new_tag.txt').trim()
            
            echo "Mise à jour du fichier version.txt avec la version: ${appVersion}"
            
            // Définir le chemin complet du fichier version.txt
            def versionFile = 'src/version.txt'
            
            // Formater la date au format JJ/MM/AAAA
            def today = new Date()
            def formattedDate = today.format('dd/MM/yyyy')
            
            // Configuration git pour le merge
            sh "git config user.email 'tallahmad047@gmail.com'"
            sh "git config user.name 'tallahmad047'"
            
            // Vérifier le nom de la branche actuelle
            def currentBranch = env.BRANCH_NAME ?: 'devs'
            
            withCredentials([usernamePassword(credentialsId: 'github-creds', usernameVariable: 'GITHUB_USER', passwordVariable: 'GITHUB_TOKEN')]) {
                sh 'git config credential.helper "!f() { echo username=\\$GITHUB_USER; echo password=\\$GITHUB_TOKEN; }; f"'
                
                // ========== APPROCHE ALTERNATIVE: RESET COMPLET ==========
                // Au lieu de tenter un merge qui peut causer des conflits, 
                // simplement récupérer l'état distant et appliquer nos modifications par-dessus
                
                // 1. Récupérer les références distantes
                sh "git fetch origin ${currentBranch}"
                
                // 2. Réinitialiser la branche locale à l'état distant
                sh "git reset --hard origin/${currentBranch}"
                
                // 3. Maintenant créer/mettre à jour le fichier version.txt
                def versionContent = """Version: ${appVersion}
Branch: ${currentBranch}
Build: ${BUILD_NUMBER}
Date: ${formattedDate}"""
                
                // Écrire dans le fichier
                writeFile file: versionFile, text: versionContent
                
                // 4. Ajouter et committer le changement
                sh "git add ${versionFile}"
                sh "git commit -m 'Mise à jour de version.txt pour la version ${appVersion} (build ${BUILD_NUMBER})'"
                
                // 5. Pousser le changement
                sh "git push origin HEAD:${currentBranch}"
            }
            
            echo "Fichier ${versionFile} mis à jour avec la version ${appVersion} et poussé."
        }
    }
}
        stage('Installer les dépendances') {
            steps {
                sh 'npm install'
            }
        }
       stage('Build and Push Docker Image') {
            
            steps {
                script {
                    def imageTag = "tallahmad047/repo:cinema-web_${env.BRANCH_NAME}_v${APP_VERSION}"
                    dir('artp-admin-web') {
                        echo "Building Docker image: ${imageTag}"
                        sh "docker build -t ${imageTag} ."
                        sh "docker run -d -p 4200:4200 ${imageTag}"

                       
                    }
                   
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
        always {
            // Nettoyer les fichiers temporaires
            sh 'rm -f app_version.txt new_tag.txt || true'
        }
    }
}
