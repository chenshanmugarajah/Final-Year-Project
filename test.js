let users = {
  "chen": { 
    "explane":2,"question":1,"goback":1,"louder":0,"slower":0,"faster":0,"clearer":0,"breaktime":3
  },
  "test": {
    "explane":2,"question":3,"goback":0,"louder":0,"slower":3,"faster":0,"clearer":0,"breaktime":0
  }
}

console.log('\nTest file\n')

let collatedVotes = {}
let usersList = {}
let usersTotalVotes = {}

let ts = 0;

// collatedVotes[ts] = {
//   votes: {
//     explane: 1,
//     faster: 2
//   },
//   mostVoted: "faster",
//   intVotes: 3
// }

// usersList[ts] = {
//   username: {
//     votes: {
//       explane: 1,
//       faster: 2
//     },
//     mostVoted: 'faster',
//     totalVotes: 3
//   }
// }

function getUsers (users) {
  usersList[ts] = []
  collatedVotes[ts] = []
  usersTotalVotes[ts] = 0
  for (let user in users) {
    usersList[ts][user] = {
      votes: users[user],
      mostVoted: mostVoted(users[user]),
      totalVotes: totVotes(users[user])
    }
    collateVotes(user)
  }
  console.log(usersList)
  console.log(usersTotalVotes)
  ts += 5
}

function collateVotes(user) {
  for (let data in user) {
    collatedVotes[ts] 
  }
}

function totVotes (user) {
  let total = 0;
  for(let data in user) {
    total += user[data]
  }
  usersTotalVotes[ts] += total
  return total
}

function mostVoted (user) {
  let dataArr = []
  for(let data in user) {
    dataArr.push({
      name: data,
      value: user[data]
    })
  }
  dataArr.sort(function (a, b) {
    if (a.value > b.value) {
      return -1
    } else if (b.value > a.value) {
      return +1
    } else {
      return 0
    }
  })
  return dataArr[0].name
}

setInterval(() => {
  getUsers(users)
}, 5000);