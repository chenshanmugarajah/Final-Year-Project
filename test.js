let users = {"111":{"explane":2,"question":1,"goback":1,"louder":0,"slower":0,"faster":0,"clearer":0,"breaktime":3},"test":{"explane":2,"question":3,"goback":0,"louder":0,"slower":3,"faster":0,"clearer":0,"breaktime":0}}

console.log('\nTest file\n')

let votes = {}

function sortData () {

  for(let user in users) {
    let userData = users[user]
    delete userData.username

    for (let data in userData){
      if(votes[data] == undefined) {
        votes[data] = 0;
      }
    }

    for (let data in userData){
      votes[data] += userData[data]
    }
  }

  console.log(votes)

}

sortData()