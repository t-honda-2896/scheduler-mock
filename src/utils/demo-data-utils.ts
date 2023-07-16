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
      startAt: `${format(date, "yyyy/MM/dd")}T09:00:00Z`,
      endAt: `${format(date, "yyyy/MM/dd")}T18:00:00Z`,
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
      startAt: `${format(date, "yyyy/MM/dd")}T09:00:00Z`,
      endAt: `${format(date, "yyyy/MM/dd")}T12:00:00Z`,
    });
    id++;
    prev.push({
      id,
      userId: curr.id,
      constructionId: 0,
      startAt: `${format(date, "yyyy/MM/dd")}T12:00:00Z`,
      endAt: `${format(date, "yyyy/MM/dd")}T13:00:00Z`,
    });
    id++;
    prev.push({
      id,
      userId: curr.id,
      constructionId: toSite.id,
      startAt: `${format(date, "yyyy/MM/dd")}T13:00:00Z`,
      endAt: `${format(date, "yyyy/MM/ddT")}T18:00:00Z`,
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
  console.log("enabledConstructionSites:", enabledConstructionSites);

  const randomUsers = getRandomElements<SampleUser>(SAMPLE_USERS, 6);
  if (enabledConstructionSites.length === 1) {
    schedule.push(
      ...createOneDaySchedules(randomUsers, enabledConstructionSites[0], date)
    );
  }
  if (enabledConstructionSites.length === 2) {
    const nextUsers = SAMPLE_USERS.filter(
      (user) => !randomUsers.includes(user)
    );
    const duplicatedUsers = getRandomElements<SampleUser>(randomUsers, 2);
    schedule.push(
      ...createOneDaySchedules(randomUsers, enabledConstructionSites[0], date)
    );
    schedule.push(
      ...createOneDaySchedules(nextUsers, enabledConstructionSites[1], date)
    );
    schedule.push(
      ...createCrossSchedules(
        duplicatedUsers,
        enabledConstructionSites[0],
        enabledConstructionSites[1],
        date
      )
    );
  }
  return schedule;
}

export function generateSchedule() {
  const schedule: SampleSchedule[] = [];
  const today = new Date();
  for (let i = 0; i < 66; i++) {
    schedule.push(...generate(addDays(today, i)));
  }
  return schedule;
}
