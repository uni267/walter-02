def nowdt = ''
pipeline {
  agent none
  stages {
    stage('back-end-test') {
      environment{
        NODE_ENV='test'
      }
      agent {
        docker 'cloudstoragesv:2019072900'
      }
      stages {
        stage('test-init') {
          steps {
            dir(path: 'server') {
              sh 'curl -X GET http://172.17.0.2:9200/'
              sh 'echo ${NODE_ENV}'
              sh 'npm install'
              sh 'mkdir test'
            }
          }
        }
        stage('runtest'){
          steps {
            parallel (
              file1:{
                dir(path: 'server') {
                  sh "npm run test -- --outputFile=./test/file_result.json --json ./lib/controllers/files.spec.js"
                  sh "npm run test -- --outputFile=./test/file2_result.json --json ./lib/controllers/files.spec.js"
                }
              },
              file2:{
                dir(path: 'server') {
                  sh "npm run test -- --outputFile=./test/file7_result.json --json ./lib/controllers/files.spec.js"
                }
              },
              file3:{
                dir(path: 'server') {
                  sh "npm run test -- --outputFile=./test/file3_result.json --json ./lib/controllers/files.spec.js"
                }
              },
              file4:{
                dir(path: 'server') {
                  sh "npm run test -- --outputFile=./test/file4_result.json --json ./lib/controllers/files.spec.js"
                }
              },
              file5:{
                dir(path: 'server') {
                  sh "npm run test -- --outputFile=./test/file5_result.json --json ./lib/controllers/files.spec.js"
                }
              },
              file6:{
                dir(path: 'server') {
                  sh "npm run test -- --outputFile=./test/file6_result.json --json ./lib/controllers/files.spec.js"
                }
              }
            )
          }
        }
      }
      post{
        always {
          script {
            nowdt = sh(script: "date '+%Y%m%d%H%M'",returnStdout:true)
            sh "tar czf test.tgz server/test"
            archiveArtifacts artifacts: "test.tgz" , fingerprint: true
          }
        }
      }
    }
    stage('Build-Front-end') {
      environment{
        NODE_ENV='production'
      }
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
              def fname="clientbuild_"+nowdt.trim()+".tgz"
              def rncmd="tar -czf "+ fname + " client/build"
              sh rncmd
              archiveArtifacts artifacts: fname , fingerprint: true
              stash name: 'clientbuild', includes: fname
          }
        }
      }
    }
    stage('Build-Back-end') {
      environment{
        NODE_ENV=''
      }
      agent {
        docker 'cloudstoragesv:2019072900'
      }
      steps {
        dir(path: 'server') {
          sh 'echo ${NODE_ENV}'
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
                sh "git push $url -u topic/jest release/"+nowdt
          }
        }
      }
    }
  }
}
