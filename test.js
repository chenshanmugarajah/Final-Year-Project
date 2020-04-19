let usersList = {}
let totalUserVotes = {}
let ts = 0;
let bestStudent = {
  name: "",
  points: 0
}
let worstStudent = {
  name: "",
  points: 10000
}

function getUsers (users) {
  usersList[ts] = []
  totalUserVotes[ts] = 0
  for (let user in users) {
    usersList[ts][user] = {
      votes: users[user],
      mostVoted: mostVoted(users[user]),
      totalVotes: totVotes(users[user])
    }
  }
  for(let user in usersList[ts]) {
    if(bestStudent.points < usersList[ts][user].totalVotes) {
      bestStudent.name = user,
      bestStudent.points = usersList[ts][user].totalVotes
    }
    if(worstStudent.points > usersList[ts][user].totalVotes) {
      worstStudent.name = user,
      worstStudent.points = usersList[ts][user].totalVotes
    } 
  }
  // ts += 5
}

function totVotes (user) {
  let total = 0;
  for(let data in user) {
    total += user[data]
  }
  totalUserVotes[ts] += total
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

getUsers(users)

document.getElementById("best-student-div").innerHTML += bestStudent.name;
document.getElementById("worst-student-div").innerHTML += worstStudent.name;
document.getElementById("total-votes-div").innerHTML += totalUserVotes[ts];