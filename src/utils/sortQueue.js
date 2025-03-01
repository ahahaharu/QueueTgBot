const { getPriorityForLessonByID } = require("../database/database");

async function sortQueue(subjectQueue, lesson, type) {
  const priorityIndex = {
    Красный: 0,
    Жёлтый: 1,
    Зелёный: 2,
    Санкции: 2,
  };

  // const subjectQueue = await getQueue(lesson.name);
  let queue = [];
  if (type === 0) {
    if (lesson.isPriority) {
      queue.push([], [], []);

      for (const sb of subjectQueue) {
        let item;
        let priority;
        if (lesson.isBrigadeType) {
          priority = await getPriorityForLessonByID(sb.brigade_num, lesson);
          item = {
            brigade_num: sb.brigade_num,
            labs: sb.labs,
            ...(lesson.isPriority && { priority: priority }),
          };
        } else {
          priority = await getPriorityForLessonByID(sb.tg_id, lesson);
          item = {
            tg_id: sb.tg_id,
            surname: sb.surname,
            labs: sb.labs,
            subgroup: sb.subgroup,
            ...(lesson.isPriority && { priority: priority }),
          };
        }
        queue[priorityIndex[priority]].push(item);
      }
      queue = queue.flat();
    } else {
      for (const sb of subjectQueue) {
        let item;
        let priority;
        if (lesson.isBrigadeType) {
          item = {
            brigade_num: sb.brigade_num,
            labs: sb.labs,
            ...(lesson.isPriority && { priority: priority }),
          };
        } else {
          item = {
            tg_id: sb.tg_id,
            surname: sb.surname,
            labs: sb.labs,
            subgroup: sb.subgroup,
            ...(lesson.isPriority && { priority: priority }),
          };
        }
        queue.push(item);
      }
    }
  } else {
    queue.push([], []);
    if (lesson.isPriority) {
      queue[0].push([], [], []);
      queue[1].push([], [], []);

      for (const sb of subjectQueue) {
        let item;
        let priority;
        if (lesson.isBrigadeType) {
          priority = await getPriorityForLessonByID(sb.brigade_num, lesson);
          item = {
            brigade_num: sb.brigade_num,
            labs: sb.labs,
            ...(lesson.isPriority && { priority: priority }),
          };
        } else {
          priority = await getPriorityForLessonByID(sb.tg_id, lesson);
          item = {
            tg_id: sb.tg_id,
            surname: sb.surname,
            labs: sb.labs,
            subgroup: sb.subgroup,
            ...(lesson.isPriority && { priority: priority }),
          };
        }
        queue[sb.subgroup - 1][priorityIndex[priority]].push(item);
      }
      queue[0] = queue[0].flat();
      queue[1] = queue[1].flat();
    } else {
      subjectQueue.forEach((sb) => {
        const item = {
          tg_id: sb.tg_id,
          surname: sb.surname,
          labs: sb.labs,
          subgroup: sb.subgroup,
          ...(lesson.isPriority && { priority: priority }),
        };

        queue[sb.subgroup - 1].push(item);
      });
    }
    if (type != 3) {
      queue = queue.flat();
    }
  }
  return queue;
}

module.exports = sortQueue;
