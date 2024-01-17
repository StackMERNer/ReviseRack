import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
} from 'react-native';
interface Range {
  startDate: Date;
  endDate: Date;
}
interface dateType {
  day: number;
  isToday?: boolean;
  isInRange?: boolean;
  isFirstDate?: boolean;
  isLastDate?: boolean;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
  inactive?: true;
}
const Calendar = ({
  ranges = [],
  colors = [],
}: {
  ranges: Range[];
  colors: string[];
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currYear, setCurrYear] = useState(currentDate.getFullYear());
  const [currMonth, setCurrMonth] = useState(currentDate.getMonth());
  const months = [
    'জানুয়ারি',
    'ফেব্রুয়ারি',
    'মার্চ',
    'এপ্রিল',
    'মে',
    'জুন',
    'জুলাই',
    'আগস্ট',
    'সেপ্টেম্বর',
    'অক্টোবর',
    'নভেম্বর',
    'ডিসেম্বর',
  ];

  const renderCalendarr = () => {
    let date = new Date();
    // ... (same logic as your web version)

    const data: dateType[] = [];
    for (let i = 1; i <= lastDateofMonth; i++) {
      // ... (same logic as your web version)
      data.push({
        day: i,
        isToday:
          i === date.getDate() &&
          currMonth === date.getMonth() &&
          currYear === date.getFullYear(),
        // ... (other flags as needed)
      });
    }

    return data;
  };
  const renderCalendar = () => {
    let date = new Date();
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
      lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
      lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
      lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();

    const dates: dateType[] = [];
    for (let i = firstDayofMonth; i > 0; i--) {
      dates.push({day: lastDateofLastMonth - i + 1, inactive: true});
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
      let isToday =
        i === date.getDate() &&
        currMonth === new Date().getMonth() &&
        currYear === new Date().getFullYear();

      const targetdate = new Date(`${currYear}-${currMonth + 1}-${i}`);
      let isInRange = false;
      let isRangeStart = false;
      let isRangeEnd = false;
      for (let index = 0; index < ranges.length; index++) {
        const range = ranges[index];
        const start = new Date(range.startDate);
        const end = new Date(range.endDate);
        const startDateOnlyString = new Date(
          `${start.getFullYear()}-${start.getMonth() + 1}-${start.getDate()}`,
        );
        const endDateOnlyString = new Date(
          `${end.getFullYear()}-${end.getMonth() + 1}-${end.getDate()}`,
        );

        if (
          targetdate >= startDateOnlyString &&
          targetdate <= endDateOnlyString
        ) {
          isInRange = true;

          if (
            targetdate.getDate() === start.getDate() &&
            targetdate.getMonth() === start.getMonth()
          ) {
            isRangeStart = true;
          }
          if (
            targetdate.getDate() === end.getDate() &&
            targetdate.getMonth() === end.getMonth()
          ) {
            isRangeEnd = true;
          }
          break;
        }
      }

      const rightRowDateReminder =
        firstDayofMonth !== 0 ? 7 - firstDayofMonth : 0;
      const leftSideRowReminder =
        rightRowDateReminder !== 6 ? rightRowDateReminder + 1 : 0;
      const isInlastOfRow = i % 7 === rightRowDateReminder;
      const isFirstOfRow = i % 7 === leftSideRowReminder;

      const isFirstDate = i === 1;
      const isLastDate = i === lastDateofMonth;
      const shouldAddBorderRight = isInRange && !isInlastOfRow && !isRangeEnd;
      const liClasses = `${
        isFirstDate ? 'rounded-l-full ' : isLastDate ? 'rounded-r-full ' : ''
      }${isRangeStart || isFirstOfRow ? 'rounded-l-full ' : ''}${
        isInRange
          ? ` bg-c-primary dark:bg-dark-btn-primary  dark:text-dark-card-primary text-white `
          : ''
      } ${isToday} ${isRangeEnd || isInlastOfRow ? 'rounded-r-full' : ''}  ${
        shouldAddBorderRight
          ? 'border-r-[1px] border-white dark:border-black'
          : ''
      }`;
      dates.push({
        day: i,
        isFirstDate: isFirstDate,
        isLastDate: isLastDate,
        isInRange: isInRange,
        isRangeEnd: isRangeEnd,
        isRangeStart: isRangeStart,
        isToday: isToday,
      });
    }

    for (let i = lastDayofMonth; i < 6; i++) {
      dates.push({day: i - lastDayofMonth + 1, inactive: true});
    }
    return dates;
  }; //here ends

  const handleUpdatingMonth = method => {
    if (method === 'increase') {
      const nextMonth = currMonth < 11 ? currMonth + 1 : 0;
      const nextYear = currMonth < 11 ? currYear : currYear + 1;
      setCurrMonth(nextMonth);
      setCurrYear(nextYear);
    } else {
      const prevMonth = currMonth > 0 ? currMonth - 1 : 11;
      const prevYear = currMonth > 0 ? currYear : currYear - 1;
      setCurrMonth(prevMonth);
      setCurrYear(prevYear);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => handleUpdatingMonth('decrease')}
            style={styles.arrowButton}>
            {/* Icon for previous month */}
          </TouchableOpacity>
          <Text
            style={
              styles.headerText
            }>{`${months[currMonth]} ${currYear}`}</Text>
          <TouchableOpacity
            onPress={() => handleUpdatingMonth('increase')}
            style={styles.arrowButton}>
            {/* Icon for next month */}
          </TouchableOpacity>
        </View>

        {/* Calendar Body */}
        <FlatList
          data={renderCalendar()}
          numColumns={7}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[styles.day, item.isToday && styles.today]}>
              <Text style={styles.dayText}>{item.day}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    width: '94%',
    borderRadius: 2,
    paddingVertical: 45,
    paddingHorizontal: 25,
    // width: '100%',
    elevation: 3,
    shadowColor: 'gray',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  calendarContainer: {
    width: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  arrowButton: {
    padding: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  day: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  today: {
    backgroundColor: 'blue', // Adjust color as needed
  },
  dayText: {
    fontSize: 12,
  },
});

export default Calendar;
