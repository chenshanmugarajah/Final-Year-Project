let data = [{ "explane": 0, "question": 0, "password": "$2a$10$BKXlu//I6Bbzmb/c4fcQDeZeQkaSIBOs.UgvkEce.PFk43RZBOzpe", "goback": 0, "emotion": "HAPPY", "louder": 0, "slower": 0, "username": "chen", "faster": 0, "clearer": 0, "breaktime": 0 }, { "explane": 0, "question": 0, "password": "$2a$10$T1peRdc5OAQZdf05fxmUq.UGheDCej1bNrIcl2RwC8Szbp.5KY3i6", "goback": 0, "emotion": "CALM", "louder": 0, "slower": 0, "username": "test", "faster": 0, "clearer": 0, "breaktime": 0 }, { "explane": 0, "question": 0, "password": "$2a$10$T1peRdc5OAQZdf05fxmUq.UGheDCej1bNrIcl2RwC8Szbp.5KY3i6", "goback": 0, "emotion": "CALM", "louder": 0, "slower": 0, "username": "test", "faster": 0, "clearer": 0, "breaktime": 0 }, { "explane": 0, "question": 0, "password": "$2a$10$T1peRdc5OAQZdf05fxmUq.UGheDCej1bNrIcl2RwC8Szbp.5KY3i6", "goback": 0, "emotion": "MEH", "louder": 0, "slower": 0, "username": "test", "faster": 0, "clearer": 0, "breaktime": 0 }, { "explane": 0, "question": 0, "password": "$2a$10$T1peRdc5OAQZdf05fxmUq.UGheDCej1bNrIcl2RwC8Szbp.5KY3i6", "goback": 0, "emotion": "CALM", "louder": 0, "slower": 0, "username": "test", "faster": 0, "clearer": 0, "breaktime": 0 }, { "explane": 0, "question": 0, "password": "$2a$10$T1peRdc5OAQZdf05fxmUq.UGheDCej1bNrIcl2RwC8Szbp.5KY3i6", "goback": 0, "emotion": "CALM", "louder": 0, "slower": 0, "username": "test", "faster": 0, "clearer": 0, "breaktime": 0 }]

// let users = [];

// let classroom = {
//   breaktime: 0,
//   louder: 0,
//   question: 0,
//   explane: 0,
//   goback: 0,
//   faster: 0,
//   slower: 0,
//   clearer: 0,
//   emotion: getClassEmotion()
// };

function getClassEmotion(data) {
  var classEmotion = {}

  for (let student in data) {
    let studentEmotion = data[student].emotion;
    if (!classEmotion[studentEmotion]) {
      classEmotion[studentEmotion] = 1
    } else {
      classEmotion[studentEmotion] += 1
    }
  }
  var sortable = [];
  for (var emotion in classEmotion) {
    sortable.push([emotion, classEmotion[emotion]]);
  }

  sortable.sort(function (a, b) {
    return a[1] - b[1];
  });

  let test = sortable.pop()[0]
  console.log(test)
}

getClassEmotion(data);