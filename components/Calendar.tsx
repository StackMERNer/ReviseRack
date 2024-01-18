import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
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
  isBorderInRight?: boolean;
  isRoundedRight?: boolean;
  isRoundedLeft?: boolean;
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

  function convertEnglishToBengali(englishNumber: string) {
    const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

    // Using regular expression to replace each English digit with its corresponding Bengali digit
    const bengaliNumber = englishNumber.replace(/\d/g, match => {
      return bengaliDigits[parseInt(match, 10)];
    });

    return bengaliNumber;
  }
  const weekDays = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];
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

      dates.push({
        day: i,
        isFirstDate: isFirstDate,
        isLastDate: isLastDate,
        isInRange: isInRange,
        isRangeEnd: isRangeEnd,
        isRangeStart: isRangeStart,
        isToday: isToday,
        isBorderInRight: shouldAddBorderRight,
        isRoundedLeft: isFirstOfRow,
        isRoundedRight: isInlastOfRow,
        // isRoundedRight: shouldAddBorderRight,
      });
    }

    for (let i = lastDayofMonth; i < 6; i++) {
      dates.push({day: i - lastDayofMonth + 1, inactive: true});
    }
    return dates;
  }; //here ends

  const handleUpdatingMonth = (method: 'increase' | 'decrease') => {
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
    <View
      style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
      <View style={styles.container}>
        <View style={styles.calendarContainer}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => handleUpdatingMonth('decrease')}
              style={styles.arrowButton}>
              <Text style={styles.arrowText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerText}>{`${
              months[currMonth]
            } ${convertEnglishToBengali(currYear.toString())}`}</Text>
            <TouchableOpacity
              onPress={() => handleUpdatingMonth('increase')}
              style={styles.arrowButton}>
              <Text style={styles.arrowText}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Calendar Body */}
          <View style={styles.weekDays}>
            {weekDays.map((week, index) => (
              <Text style={styles.weekDay} key={index}>
                {week}
              </Text>
            ))}
          </View>
          <FlatList
            data={renderCalendar()}
            numColumns={7}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View
                style={[
                  styles.day,
                  item.isInRange && styles.bgBlue,
                  (item.isFirstDate ||
                    item.isRangeStart ||
                    item.isRoundedLeft) &&
                    styles.roundLeft,
                  (item.isRangeEnd || item.isRoundedRight || item.isLastDate) &&
                    styles.roundRight,
                  item.isBorderInRight && styles.borderRight,
                ]}>
                <Text
                  style={[
                    item.isInRange ? styles.textWhite : styles.dayText,
                    item.isToday && styles.today,
                    item.inactive && {color: 'lightgray'},
                  ]}>
                  {convertEnglishToBengali(item.day.toString())}
                </Text>
              </View>
            )}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '96%',
    borderRadius: 10,
    paddingVertical: 25,
    paddingHorizontal: 15,
    // elevation: 10,
    shadowColor: 'gray',
    backgroundColor: 'white',
    shadowOffset: {width: -2, height: 4},
    marginHorizontal: 'auto',
    marginVertical: 'auto',
    shadowOpacity: 1,
    shadowRadius: 3,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  calendarContainer: {
    width: '98%',
  },
  weekDay: {fontSize: 14, color: 'black'},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 35,
    paddingTop: 15,
  },
  arrowButton: {
    paddingHorizontal: 10,
    backgroundColor: '#d3d3d3',
    borderRadius: 2,
  },
  arrowText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  day: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 3,
    marginBottom: 6,
    // paddingHorizontal: 10,
  },
  //   border:{
  //     border
  //   },
  today: {
    borderBottomWidth: 3,
    borderBottomColor: 'blue',
    // backgroundColor: 'blue', // Adjust color as needed
  },
  // inRange:{},
  bgBlue: {
    backgroundColor: 'blue',
  },
  textWhite: {
    color: 'white',
  },
  roundLeft: {
    borderTopLeftRadius: 50, // You can adjust the radius value as needed
    borderBottomLeftRadius: 50, // You can adjust the radius value as needed
    // ... other styles
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: 'white',
  },
  roundRight: {
    borderTopRightRadius: 50, // You can adjust the radius value as needed
    borderBottomRightRadius: 50, // You can adjust the radius value as needed
    // ... other styles
  },

  dayText: {
    fontSize: 14,
    color: 'black',
    paddingBottom: 2,
  },
});

export default Calendar;
