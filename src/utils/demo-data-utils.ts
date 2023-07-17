import { addDays, format, isAfter, isBefore } from "date-fns";
import {
  SAMPLE_CONSTRUCTION_SITES,
  SAMPLE_USERS,
  SampleConstructionSite,
  SampleSchedule,
  SampleUser,
} from "../constants/demo-data-constants";

let id = 1;

function getRandomElements<S>(array: S[], count: number): S[] {
  const shuffledArray = array.sort(() => Math.random() - 0.5);
  return shuffledArray.slice(0, count);
}

function createOneDaySchedules(
  users: SampleUser[],
  site: SampleConstructionSite,
  date: Date
): SampleSchedule[] {
  return users.reduce((prev: SampleSchedule[], curr) => {
    prev.push({
      id,
      userId: curr.id,
      constructionId: site.id,
      startAt: `${format(date, "yyyy-MM-dd")}T09:00:00Z`,
      endAt: `${format(date, "yyyy-MM-dd")}T18:00:00Z`,
    });
    id++;
    return prev;
  }, []);
}
function createCrossSchedules(
  users: SampleUser[],
  fromSite: SampleConstructionSite,
  toSite: SampleConstructionSite,
  date: Date
): SampleSchedule[] {
  return users.reduce((prev: SampleSchedule[], curr) => {
    prev.push({
      id,
      userId: curr.id,
      constructionId: fromSite.id,
      startAt: `${format(date, "yyyy-MM-dd")}T09:00:00Z`,
      endAt: `${format(date, "yyyy-MM-dd")}T12:00:00Z`,
    });
    id++;
    prev.push({
      id,
      userId: curr.id,
      constructionId: 0,
      startAt: `${format(date, "yyyy-MM-dd")}T12:00:00Z`,
      endAt: `${format(date, "yyyy-MM-dd")}T13:00:00Z`,
    });
    id++;
    prev.push({
      id,
      userId: curr.id,
      constructionId: toSite.id,
      startAt: `${format(date, "yyyy-MM-dd")}T13:00:00Z`,
      endAt: `${format(date, "yyyy-MM-dd")}T18:00:00Z`,
    });
    id++;
    return prev;
  }, []);
}

function generate(date: Date) {
  const schedule: SampleSchedule[] = [];
  const enabledConstructionSites = SAMPLE_CONSTRUCTION_SITES.reduce(
    (prev: SampleConstructionSite[], curr) => {
      if (
        isBefore(curr.startDate, addDays(date, 1)) &&
        isAfter(curr.endDate, addDays(date, 1))
      )
        prev.push(curr);
      return prev;
    },
    []
  );

  if (enabledConstructionSites.length === 2) {
    const randomUsers = getRandomElements<SampleUser>(SAMPLE_USERS, 6);
    schedule.push(
      ...createOneDaySchedules(randomUsers, enabledConstructionSites[1], date)
    );
  }
  if (enabledConstructionSites.length === 3) {
    const oneDay1Users = getRandomElements<SampleUser>(SAMPLE_USERS, 4);
    const oneDay2Users = getRandomElements<SampleUser>(
      SAMPLE_USERS.filter((user) => !oneDay1Users.includes(user)),
      4
    );
    const crossUsers = SAMPLE_USERS.filter(
      (user) => !oneDay1Users.includes(user) && !oneDay2Users.includes(user)
    );
    schedule.push(
      ...createOneDaySchedules(oneDay1Users, enabledConstructionSites[1], date)
    );
    schedule.push(
      ...createOneDaySchedules(oneDay2Users, enabledConstructionSites[2], date)
    );
    schedule.push(
      ...createCrossSchedules(
        crossUsers,
        enabledConstructionSites[1],
        enabledConstructionSites[2],
        date
      )
    );
  }
  if (enabledConstructionSites.length === 4) {
    const oneDay1Users = getRandomElements<SampleUser>(SAMPLE_USERS, 2);
    const oneDay2Users = getRandomElements<SampleUser>(
      SAMPLE_USERS.filter((user) => !oneDay1Users.includes(user)),
      2
    );
    const oneDay3Users = getRandomElements<SampleUser>(
      SAMPLE_USERS.filter(
        (user) => !oneDay1Users.includes(user) && !oneDay2Users.includes(user)
      ),
      2
    );
    const crossUsers = SAMPLE_USERS.filter(
      (user) =>
        !oneDay1Users.includes(user) &&
        !oneDay2Users.includes(user) &&
        !oneDay3Users.includes(user)
    );
    const cross1Users = getRandomElements<SampleUser>(crossUsers, 1);
    const cross2Users = getRandomElements<SampleUser>(
      crossUsers.filter((user) => !cross1Users.includes(user)),
      1
    );
    const cross3Users = getRandomElements<SampleUser>(
      crossUsers.filter(
        (user) => !cross1Users.includes(user) && !cross2Users.includes(user)
      ),
      1
    );
    const cross4Users = getRandomElements<SampleUser>(
      crossUsers.filter(
        (user) =>
          !cross1Users.includes(user) &&
          !cross2Users.includes(user) &&
          !cross3Users.includes(user)
      ),
      1
    );
    schedule.push(
      ...createOneDaySchedules(oneDay1Users, enabledConstructionSites[1], date)
    );
    schedule.push(
      ...createOneDaySchedules(oneDay2Users, enabledConstructionSites[2], date)
    );
    schedule.push(
      ...createOneDaySchedules(oneDay2Users, enabledConstructionSites[3], date)
    );
    schedule.push(
      ...createCrossSchedules(
        cross1Users,
        enabledConstructionSites[1],
        enabledConstructionSites[2],
        date
      )
    );
    schedule.push(
      ...createCrossSchedules(
        cross2Users,
        enabledConstructionSites[2],
        enabledConstructionSites[3],
        date
      )
    );
    schedule.push(
      ...createCrossSchedules(
        cross3Users,
        enabledConstructionSites[3],
        enabledConstructionSites[1],
        date
      )
    );
    schedule.push(
      ...createCrossSchedules(
        cross4Users,
        enabledConstructionSites[3],
        enabledConstructionSites[2],
        date
      )
    );
  }
  return schedule;
}

export function generateSchedule() {
  const schedule: SampleSchedule[] = [];
  const startDate = new Date("2023/07/01 00:00:00");
  for (let i = 0; i < 66; i++) {
    schedule.push(...generate(addDays(startDate, i)));
  }
  return schedule;
}

export function getUserNameById(id: number) {
  return SAMPLE_USERS.find((user) => user.id === id)?.name || "";
}
