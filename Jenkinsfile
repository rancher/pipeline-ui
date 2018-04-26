pipeline {
  agent {
    docker {
      image 'busybox'
      args 'ls'
    }
    
  }
  stages {
    stage('') {
      steps {
        sh 'ls'
      }
    }
  }
}