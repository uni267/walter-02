def nowdt = ''
pipeline {
  agent none
  stages {
    stage('Front-end') {
      agent {
        docker 'node:8.15'
      }
      steps {
        dir(path: 'client') {
          sh 'npm install'
          sh 'npm run build'
        }
      }
      post {
        success {
          script {
              sh(script: "ls")
              nowdt = sh(script: "date '+%Y%m%d%H%M'",returnStdout:true)
              def fname="clientbuild_"+nowdt.trim()+".tgz"
              def rncmd="tar -czf "+ fname + " client/build"
              sh rncmd
              archiveArtifacts artifacts: fname , fingerprint: true
              stash name: 'clientbuild', includes: fname
          }
        }
      }
    }
    stage('Back-end') {
      agent {
        docker 'node:10.16'
      }
      steps {
        dir(path: 'server') {
          sh 'npm install'
          sh 'npm run build'
        }
      }
      post {
        success {
          script {
            def fname="serverdist_"+nowdt.trim()+".tgz"
            def rncmd="tar -czf "+ fname + " server/dist"
            sh(script: rncmd )
            archiveArtifacts artifacts: fname , fingerprint: true
            stash name: 'serverdist', includes: fname
          }
        }
      }
    }
    stage('push-release') {
      agent any
      steps {
        script {
          def userRemoteConfig = scm.userRemoteConfigs.head()
          withCredentials([[$class: 'UsernamePasswordMultiBinding',
              credentialsId: userRemoteConfig.credentialsId,
                usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASSWORD']]) {
                def url = userRemoteConfig.url.replace('://', "://${env.GIT_USER}:${env.GIT_PASSWORD}@")
                sh "git checkout -b release/"+nowdt
                unstash name: 'serverdist'
                unstash name: 'clientbuild'
                sh "tar xzf serverdist_" + nowdt.trim()+".tgz"
                sh "tar xzf clientbuild_" + nowdt.trim()+".tgz"
                sh 'git add -f client/build'
                sh 'git add -f server/dist'
                sh 'git add .'
                sh 'git rm Jenkinsfile'
                sh "git config --global user.email 'you@example.com'"
                sh "git config --global user.name 'jenkins'"
                sh "git commit -m 'release'"
                sh "git push $url -u develop release/"+nowdt
          }
        }
      }
    }
  }
}
