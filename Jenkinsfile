stage('Update Version File') {
    steps {
        script {
            // Lire la version depuis le fichier temporaire créé à l'étape précédente
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
            
            // Récupérer les derniers changements de la branche distante
            withCredentials([usernamePassword(credentialsId: 'github-creds', usernameVariable: 'GITHUB_USER', passwordVariable: 'GITHUB_TOKEN')]) {
                sh 'git config credential.helper "!f() { echo username=\\$GITHUB_USER; echo password=\\$GITHUB_TOKEN; }; f"'
                
                // Vérifier le nom de la branche actuelle
                def currentBranch = env.BRANCH_NAME ?: 'devs'
                
                // Forcer la récupération de la branche distante
                sh "git fetch origin ${currentBranch}"
                
                // Option 1 : Merge (préserve l'historique)
                sh "git merge origin/${currentBranch} --allow-unrelated-histories -m 'Merge remote changes'"
                
                // Option 2 (alternative) : Reset (simplifié mais écrase l'historique local)
                // sh "git reset --hard origin/${currentBranch}"
            }
            
            // Créer le contenu avec le format exact souhaité et la MÊME version que le tag
            def versionContent = """Version: ${appVersion}
Branch: ${env.BRANCH_NAME ?: 'devs'}
Build: ${BUILD_NUMBER}
Date: ${formattedDate}"""
            
            // Écrire dans le fichier
            writeFile file: versionFile, text: versionContent
            
            // Ajouter, committer et pousser les changements
            sh "git add ${versionFile}"
            sh "git commit -m 'Mise à jour de version.txt pour la version ${appVersion} (build ${BUILD_NUMBER})' || echo 'Pas de changement à committer'"
            
            // Utiliser la même méthode d'authentification que pour le tag
            withCredentials([usernamePassword(credentialsId: 'github-creds', usernameVariable: 'GITHUB_USER', passwordVariable: 'GITHUB_TOKEN')]) {
                sh 'git config credential.helper "!f() { echo username=\\$GITHUB_USER; echo password=\\$GITHUB_TOKEN; }; f"'
                sh "git push origin HEAD:${env.BRANCH_NAME ?: 'devs'}"
            }
            
            echo "Fichier ${versionFile} mis à jour avec la version ${appVersion} et poussé."
        }
    }
}
