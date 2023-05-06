// Complex Relation :)

export const ToothWithBadges = {
  id: true,
  notes: true,
  number: true,
  CoursePatientTeeth: {
    select: {
      CoursePatient: {
        select: {
          id: true,
          isFinished: true,
          isOld: true,
          createdAt: true,
          finishedAt: true,
          Course: { select: { colorIndex: true, effectName: true } },
        },
      },
    },
  },
};

export const CoursePatientWithCourseAndSessionAndTeeth = {
  id: true,
  details: true,
  createdAt: true,
  isFinished: true,
  isOld: true,
  Course: true,
  CoursePatientTeeth: {
    select: {
      id: true,
      Tooth: { select: { id: true, number: true, notes: true } },
    },
  },
  Sessions: {
    select: {
      id: true,
      createdAt: true,
      details: true,
    },
  },
};
export const CoursePatientWithCourseAndTeeth = {
  id: true,
  details: true,
  createdAt: true,
  isFinished: true,
  finishedAt: true,
  isOld: true,
  Course: true,
  CoursePatientTeeth: {
    select: {
      id: true,
      Tooth: { select: { id: true, number: true, notes: true } },
    },
  },
  Sessions: { select: { id: true } },
};
