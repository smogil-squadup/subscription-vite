import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface DayProps {
  classNames: string;
  setMoreView: (value: DayType | null) => void;
  moreView: DayType | null;
  day: DayType;
  subscriptions?: {
    name: string;
    logo: string;
    payment: number;
    total: number;
    since: string;
    every: string;
    color: string;
  }[];
  modalXPosition?: "left" | "right";
}

const Day: React.FC<DayProps> = ({
  classNames,
  subscriptions,
  day,
  setMoreView,
  moreView,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <motion.div
        className={`relative flex items-end justify-center py-1 ${classNames}`}
        style={{
          height: "71.72px",
          borderRadius: 16,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() =>
          subscriptions && setMoreView(day === moreView ? null : day)
        }
        id={`day-${day.day}`}
      >
        <motion.div className="flex flex-col items-center justify-center">
          {subscriptions && (
            <div className="flex">
              {subscriptions.slice(0, 2).map((sub, index) => (
                <motion.img
                  key={index}
                  src={sub.logo}
                  alt={sub.name}
                  className="size-[22px] mb-1 hidden sm:block -mr-1"
                  layoutId={`logo-${sub.name}-${day.day}`}
                />
              ))}
              {subscriptions.length > 2 && (
                <motion.div
                  className="w-6 h-6 mb-1 -mr-1 hidden sm:flex items-center justify-center rounded-full bg-zinc-950 border border-white/10"
                  layoutId={`more-icon-${day.day}`}
                >
                  <span className="text-white text-xs">
                    +{subscriptions.length - 2}
                  </span>
                </motion.div>
              )}
            </div>
          )}
          <span className="text-sm text-white">{day.day}</span>
        </motion.div>
        <AnimatePresence>
          {subscriptions && isHovered && (
            <motion.div
              className="absolute bottom-full w-[250px] overflow-y-auto z-50"
              style={{
                left: day.modalXPosition === "left" ? 0 : "auto",
                right: day.modalXPosition === "right" ? 0 : "auto",
              }}
              initial={{ scale: 0, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0, y: 10, opacity: 0 }}
            >
              <div
                className="w-full mb-1 p-1 text-white font-medium flex items-center justify-center"
                style={{
                  borderRadius: 20,
                  background:
                    subscriptions &&
                    createGradient(
                      subscriptions?.map((sub) => sub.color) || []
                    ),
                }}
              >
                <div className="w-full p-3 bg-zinc-900 rounded-2xl max-h-[210px] overflow-y-auto">
                  {subscriptions.map((sub, index) => (
                    <React.Fragment key={index}>
                      <div className="w-full border-b border-zinc-700/50 pb-2 pt-2 first:pt-0 last:pb-0 last:border-b-0">
                        <div className="w-full flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <img
                              src={sub.logo}
                              alt={sub.name}
                              className="size-5"
                            />
                            <span className="text-lg">{sub.name}</span>
                          </div>
                          <span className="font-semibold text-lg">
                            €{sub.payment}
                          </span>
                        </div>
                        <div className="w-full flex items-center justify-between mt-1.5 mb-2">
                          <span className="text-xs">{sub.every}</span>
                          <span className="text-xs opacity-60">
                            Next payment
                          </span>
                        </div>
                        <div className="w-full flex items-center justify-between">
                          <span className="text-xs">
                            Total since {sub.since}
                          </span>
                          <span className="text-md font-semibold">
                            €{sub.total}
                          </span>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {subscriptions && (
          <div
            className="absolute top-2 right-2 size-2 rounded-full"
            style={{
              background: createGradient(
                subscriptions?.map((sub) => sub.color) || []
              ),
            }}
          ></div>
        )}
      </motion.div>
    </>
  );
};

const CalendarGrid: React.FC<{
  currentMonth: Date;
  setMoreView: (value: DayType | null) => void;
  moreView: DayType | null;
}> = ({ currentMonth, setMoreView, moreView }) => {
  // Logic to generate days for the current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days: DayType[] = [];

    // Add previous month's days
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = 0; i < firstDayOfMonth; i++) {
      const day = prevMonthDays - firstDayOfMonth + i + 1;
      days.push({
        day: day.toString(),
        classNames: "bg-zinc-700/20 opacity-40",
      });
    }

    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayString = i.toString().padStart(2, "0");
      const existingDay = DAYS.find((d) => d.day === dayString);
      days.push(existingDay || { day: dayString, classNames: "bg-[#1e1e1e]" });
    }

    // Add next month's days to fill the grid
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i.toString(), classNames: "bg-zinc-700/20 opacity-40" });
    }

    return days;
  };

  const monthDays = getDaysInMonth(currentMonth);

  return (
    <div className="grid grid-cols-7 gap-2">
      {monthDays.map((day, index) => (
        <Day
          key={`${day.day}-${index}`}
          classNames={day.classNames}
          subscriptions={day.subscriptions}
          day={day}
          setMoreView={setMoreView}
          moreView={moreView}
        />
      ))}
    </div>
  );
};

const CircularView: React.FC = () => {
  const premiumDays = DAYS.filter((day) => day.subscriptions);
  const totalPayment = premiumDays.reduce(
    (acc, curr) =>
      acc +
      curr.subscriptions!.map((s) => s.payment).reduce((a, c) => a + c, 0),
    0
  );

  // Add a gap between segments (in degrees)
  const gapAngle = 15;
  const totalGapAngle = gapAngle * premiumDays.length;
  const availableAngle = 360 - totalGapAngle;

  // Calculate the cumulative angles for each segment
  const cumulativeAngles: number[] = [];
  let cumulative = 0;
  premiumDays.forEach((day) => {
    const proportion =
      (day.subscriptions?.map((s) => s.payment).reduce((a, c) => a + c, 0) ||
        0) / totalPayment;
    const angle = proportion * availableAngle;
    cumulativeAngles.push(cumulative);
    cumulative += angle + gapAngle;
  });

  const [hoveredDay, setHoveredDay] = useState<DayType | null>(null);

  return (
    <div className="flex justify-center items-center w-full h-64 relative">
      <svg width="500" height="500" viewBox="0 0 400 400">
        <defs>
          {premiumDays.map((day, index) => {
            const colors = day.subscriptions?.map((sub) => sub.color) || [
              "#000",
            ];

            const gradientId = `gradient-${index}`;

            return (
              <linearGradient
                key={gradientId}
                id={gradientId}
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2="400"
                y2="0"
              >
                {colors.map((color, idx) => {
                  const offset =
                    colors.length === 1
                      ? "100%"
                      : `${(idx / (colors.length - 1)) * 100}%`;
                  return <stop key={idx} offset={offset} stopColor={color} />;
                })}
              </linearGradient>
            );
          })}
        </defs>

        <circle
          cx="200"
          cy="200"
          r="150"
          fill="none"
          stroke="none"
          strokeWidth="10"
        />

        {premiumDays.map((day, index) => {
          const startAngle = cumulativeAngles[index];
          const proportion =
            (day.subscriptions
              ?.map((s) => s.payment)
              .reduce((a, c) => a + c, 0) || 0) / totalPayment;
          const angle = proportion * availableAngle;

          const startRad = (Math.PI / 180) * (startAngle - 90);
          const endRad = (Math.PI / 180) * (startAngle + angle - 90);

          // Définir les points de départ et d'arrivée pour l'arc
          const x1 = 200 + 150 * Math.cos(startRad);
          const y1 = 200 + 150 * Math.sin(startRad);
          const x2 = 200 + 150 * Math.cos(endRad);
          const y2 = 200 + 150 * Math.sin(endRad);

          const largeArcFlag = angle > 180 ? 1 : 0;

          // Chemin pour l'arc
          const pathData = `
      M ${x1} ${y1}
      A 150 150 0 ${largeArcFlag} 1 ${x2} ${y2}
    `;

          // Identifiant du gradient correspondant
          const gradientId = `gradient-${index}`;

          return (
            <motion.g key={day.day}>
              {/* Arc avec gradient */}
              <motion.path
                d={pathData}
                fill="none"
                stroke={`url(#${gradientId})`}
                strokeWidth="30"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                exit={{ pathLength: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.g>
          );
        })}
      </svg>

      <div className="absolute inset-0 w-full h-full">
        {premiumDays.map((day, index) => {
          const startAngle = cumulativeAngles[index];
          const proportion =
            (day.subscriptions
              ?.map((s) => s.payment)
              .reduce((a, c) => a + c, 0) || 0) / totalPayment;
          const angle = proportion * availableAngle;
          const middleAngle = startAngle + angle / 2;
          const middleRad = (Math.PI / 180) * (middleAngle - 90);
          const logoX = 220 + 220 * Math.cos(middleRad);
          const logoY = 130 + 220 * Math.sin(middleRad);
          return (
            <motion.div
              className="hidden items-center gap-1.5 sm:flex flex-col"
              style={{
                x: logoX - 15,
                y: logoY - 15,
                position: "absolute",
                cursor: "pointer",
              }}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              {day.subscriptions?.slice(0, 2).map((sub, index) => (
                <motion.img
                  key={index}
                  src={sub.logo}
                  alt={sub.name}
                  layoutId={`logo-${sub.name}-${day.day}`}
                  className="w-6 h-6"
                />
              ))}
              {day.subscriptions && day.subscriptions?.length > 2 && (
                <motion.div
                  layoutId={`more-icon-${day.day}`}
                  className="w-6 h-6 flex items-center justify-center rounded-full bg-zinc-950 border border-white/10"
                >
                  <span className="text-white text-xs">
                    +{day.subscriptions.length - 2}
                  </span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
      <AnimatePresence>
        {hoveredDay && (
          <motion.div
            key={hoveredDay.day}
            className="absolute"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -150%)",
              pointerEvents: "none",
            }}
          >
            <div className="p-2 bg-zinc-900 text-white rounded-lg shadow-lg">
              {hoveredDay.subscriptions?.map((sub, index) => (
                <React.Fragment key={index}>
                  <div className="w-full border-b border-zinc-700/50 last:border-b-0 pt-1">
                    <div className="flex items-center gap-2">
                      <img src={sub.logo} alt={sub.name} className="w-6 h-6" />
                      <span className="font-semibold">{sub.name}</span>
                    </div>
                    <div className="mt-1">
                      <span>
                        €{sub.payment} / {sub.every}
                      </span>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => {
  const [moreView, setMoreView] = useState<null | DayType>(null);
  const [circleView, setCircleView] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [direction, setDirection] = useState(0);

  const changeMonth = (newDirection: "prev" | "next") => {
    setDirection(newDirection === "prev" ? -1 : 1);
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      if (newDirection === "prev") {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const monthName = currentMonth.toLocaleString("en-US", { month: "long" });
  const year = currentMonth.getFullYear();

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-start md:justify-center px-4 py-10 bg-black">
      <div className="relative mx-auto my-10 w-full justify-center flex flex-col lg:flex-row items-center gap-14 lg:gap-8">
        <motion.div layout className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            {circleView ? (
              <motion.div
                key="circle-view"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.5 }}
                transition={{ duration: 0.15 }}
                className="w-full flex items-center justify-center p-10 relative"
              >
                <CircularView />
                <motion.button
                  className="absolute flex flex-col items-center justify-center text-white"
                  onClick={() => setCircleView(false)}
                  layoutId="monthly-spend"
                >
                  <span className="opacity-50 text-center">Monthly spend</span>
                  <span className="text-3xl font-semibold">
                    €
                    {DAYS.filter((day) => day.subscriptions)
                      .reduce(
                        (acc, curr) =>
                          acc +
                          curr
                            .subscriptions!.map((s) => s.payment)
                            .reduce((a, c) => a + c, 0),
                        0
                      )
                      .toPrecision(4)}
                  </span>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="calendar-view"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.5 }}
                transition={{ duration: 0.15 }}
                className="w-full flex-col flex gap-4"
              >
                <div className="w-full flex items-center gap-4 justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => changeMonth("prev")}
                        className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
                      >
                        <ChevronLeft className="text-white" size={20} />
                      </button>
                      <button
                        onClick={() => changeMonth("next")}
                        className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"
                      >
                        <ChevronRight className="text-white" size={20} />
                      </button>
                    </div>
                    <motion.div className="overflow-hidden">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.h2
                          key={`${monthName}-${year}`}
                          className="sm:text-3xl text-lg flex items-center justify-start gap-1 font-bold tracking-wider text-zinc-300"
                          initial={{ y: direction * 50, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: direction * -50, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          {monthName} <span className="opacity-50">{year}</span>
                        </motion.h2>
                      </AnimatePresence>
                    </motion.div>
                  </div>
                  <motion.button
                    className="flex flex-col items-end text-white"
                    onClick={() => setCircleView(true)}
                    layoutId="monthly-spend"
                  >
                    <span className="opacity-50 text-right text-sm sm:text-md">
                      Monthly spend
                    </span>
                    <span className="text-lg sm:text-xl font-semibold">
                      €
                      {DAYS.filter((day) => day.subscriptions)
                        .reduce(
                          (acc, curr) =>
                            acc +
                            curr
                              .subscriptions!.map((s) => s.payment)
                              .reduce((a, c) => a + c, 0),
                          0
                        )
                        .toPrecision(4)}
                    </span>
                  </motion.button>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {daysOfWeek.map((day) => (
                    <div
                      key={day}
                      className="text-xs text-white text-center bg-[#323232] py-1 px-0/5 rounded-xl"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={`${monthName}-${year}-grid`}
                    initial={{ x: direction * 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: direction * -50, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <CalendarGrid
                      currentMonth={currentMonth}
                      setMoreView={setMoreView}
                      moreView={moreView}
                    />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <AnimatePresence mode="wait">
          {moreView && (
            <motion.div
              className="w-full max-w-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              key={moreView.day}
            >
              <motion.div
                key="more-view"
                className="w-full flex-col flex gap-1 relative"
              >
                <button
                  className="absolute -top-10 right-0 text-white bg-white/10 size-8 p-1.5 rounded-full flex items-center justify-center"
                  onClick={() => setMoreView(null)}
                >
                  <X />
                </button>
                <motion.div
                  className="border-2 bg-[#1e1e1e] border-[#323232] flex flex-col items-start justify-start overflow-hidden rounded-xl shadow-md h-[600px]"
                  layout
                >
                  <div className="w-full flex h-20 shrink-0 items-center border-b border-dashed border-[#323232] justify-start gap-3 p-3 overflow-x-auto">
                    {moreView.subscriptions?.map((sub, index) => {
                      return (
                        <div
                          className="size-14 shrink-0 rounded-lg flex items-center justify-center bg-opacity-50 cursor-pointer"
                          style={{
                            background: `${sub.color}20`,
                          }}
                        >
                          <img
                            key={index}
                            src={sub.logo}
                            alt={sub.name}
                            className="size-8"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <div className="w-full h-full flex flex-col items-center justify-start overflow-y-scroll">
                    {moreView.subscriptions?.map((sub, index) => (
                      <div
                        key={index}
                        className="w-full flex flex-col items-start justify-start gap-2 p-3 border-b border-[#323232] last:border-b-0"
                      >
                        <div className="w-full flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <img
                              src={sub.logo}
                              alt={sub.name}
                              className="size-8"
                            />
                            <span className="text-2xl font-semibold text-white">
                              {sub.name}
                            </span>
                          </div>
                          <span className="text-2xl font-semibold text-white">
                            €{sub.payment}
                          </span>
                        </div>
                        <div className="w-full flex items-center justify-between mt-1.5 mb-2">
                          <span className="text-sm text-white">
                            {sub.every}
                          </span>
                          <span className="text-sm text-white opacity-60">
                            Next payment
                          </span>
                        </div>
                        <div className="w-full flex items-center justify-between">
                          <span className="text-sm text-white">
                            Total since {sub.since}
                          </span>
                          <span className="text-md font-semibold text-white">
                            €{sub.total}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="h-[125px] shrink-0 border-t border-dashed border-[#323232] px-3 py-4 w-full flex flex-col items-center justify-center gap-4">
                    <div className="w-full flex items-center justify-between gap-2">
                      <h3 className="text-white/30 text-lg">Total Spend</h3>
                      <span className="text-2xl font-semibold text-white">
                        $
                        {moreView.subscriptions
                          ?.map((s) => s.payment)
                          .reduce((a, c) => a + c, 0)
                          .toPrecision(4)}
                      </span>
                    </div>
                    <div className="w-full flex items-center justify-center gap-2">
                      <button className="bg-red-500/10 border-2 border-red-500 text-red-500 w-full p-2 rounded-lg font-semibold">
                        Cancel Subscription
                      </button>
                      <button className="border-2 border-[#5e5e5e] text-[#5e5e5e] p-2 font-semibold rounded-lg">
                        Pause
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default App;

type DayType = {
  day: string;
  classNames: string;
  subscriptions?: {
    name: string;
    logo: string;
    payment: number;
    total: number;
    since: string;
    every: string;
    color: string;
  }[];
  modalXPosition?: "left" | "right";
};

function createGradient(colors: string[]): string {
  if (colors.length === 0) {
    return "none";
  }

  if (colors.length === 1) {
    return colors[0];
  }

  const gradientStops = colors
    .map((color, index) => {
      const percentage = (index / (colors.length - 1)) * 100;
      return `${color} ${percentage}%`;
    })
    .join(", ");

  return `linear-gradient(to right, ${gradientStops})`;
}

const DAYS: DayType[] = [
  { day: "-3", classNames: "bg-zinc-700/20 opacity-40" },
  { day: "-2", classNames: "bg-zinc-700/20 opacity-40" },
  { day: "-1", classNames: "bg-zinc-700/20 opacity-40" },
  { day: "01", classNames: "bg-[#1e1e1e]" },
  {
    day: "02",
    classNames: "bg-[#1e1e1e] cursor-pointer",
    subscriptions: [
      {
        name: "Linear",
        logo: "/linear.svg",
        payment: 6.99,
        total: 83.88,
        since: "2022-01-08",
        every: "Every 02th",
        color: "#5e6ad2",
      },
    ],
  },
  { day: "03", classNames: "bg-[#1e1e1e]" },
  { day: "04", classNames: "bg-[#1e1e1e]" },
  { day: "05", classNames: "bg-[#1e1e1e]" },
  { day: "06", classNames: "bg-[#1e1e1e]" },
  {
    day: "07",
    classNames: "bg-[#1e1e1e] cursor-pointer",
    subscriptions: [
      {
        name: "Make",
        logo: "/make.svg",
        payment: 2.99,
        total: 35.88,
        since: "2023-01-01",
        every: "Every 07th",
        color: "#6d0ccc",
      },
      {
        name: "AirBnb",
        logo: "/airbnb.svg",
        payment: 3.93,
        total: 47.16,
        since: "2021-01-01",
        every: "Every 07th",
        color: "#FF5A5F",
      },
    ],
  },
  { day: "08", classNames: "bg-[#1e1e1e]" },
  {
    day: "09",
    classNames: "bg-[#1e1e1e]",
  },
  { day: "10", classNames: "bg-[#1e1e1e]" },
  {
    day: "11",
    classNames: "bg-[#1e1e1e] cursor-pointer",
    subscriptions: [
      {
        name: "Supabase",
        logo: "/supabase.svg",
        payment: 7.99,
        total: 95.88,
        since: "2023-01-01",
        every: "Every 17th",
        color: "#3ecf8e",
      },
    ],
    modalXPosition: "right",
  },
  {
    day: "12",
    classNames: "bg-[#1e1e1e] cursor-pointer",
    subscriptions: [
      {
        name: "JetBrains",
        logo: "/jetbrains.svg",
        payment: 5.99,
        total: 71.88,
        since: "2023-05-03",
        every: "Every 12th",
        color: "#FFFFFF",
      },
      {
        name: "Discord",
        logo: "/discord.svg",
        payment: 3.99,
        total: 47.88,
        since: "2023-01-01",
        every: "Every 12th",
        color: "#5865F2",
      },
      {
        name: "Invision",
        logo: "/invision.svg",
        payment: 3.99,
        total: 47.88,
        since: "2023-01-01",
        every: "Every 12th",
        color: "#FF3366",
      },
      {
        name: "Miro",
        logo: "/miro.svg",
        payment: 4.99,
        total: 59.88,
        since: "2023-01-01",
        every: "Every 12th",
        color: "#fed02f",
      },
      {
        name: "Tripadvirsor",
        logo: "/tripadvisor.svg",
        payment: 3.99,
        total: 47.88,
        since: "2023-01-01",
        every: "Every 12th",
        color: "#00B2A9",
      },
      {
        name: "Basecamp",
        logo: "/basecamp.svg",
        payment: 3.99,
        total: 47.88,
        since: "2023-01-01",
        every: "Every 12th",
        color: "#F9D83D",
      },
      {
        name: "Sketch",
        logo: "/sketch.svg",
        payment: 3.99,
        total: 47.88,
        since: "2023-01-01",
        every: "Every 12th",
        color: "#F7F7F7",
      },
    ],
    modalXPosition: "right",
  },
  { day: "13", classNames: "bg-[#1e1e1e]" },
  { day: "14", classNames: "bg-[#1e1e1e]" },
  {
    day: "15",
    classNames: "bg-[#1e1e1e] cursor-pointer",
    subscriptions: [
      {
        name: "Spotify",
        logo: "/spotify.svg",
        payment: 2.99,
        total: 35.88,
        since: "2023-01-01",
        every: "Every 15th",
        color: "#1DB954",
      },
      {
        name: "Webflow",
        logo: "/webflow.svg",
        payment: 12.99,
        total: 155.88,
        since: "2023-01-01",
        every: "Every 15th",
        color: "#4353FF",
      },
      {
        name: "Adobe",
        logo: "/adobe.svg",
        payment: 3.99,
        total: 47.88,
        since: "2023-01-01",
        every: "Every 15th",
        color: "#FF0000",
      },
    ],
  },
  { day: "16", classNames: "bg-[#1e1e1e]" },
  {
    day: "17",
    classNames: "bg-[#1e1e1e]",
  },
  { day: "18", classNames: "bg-[#1e1e1e]" },
  {
    day: "19",
    classNames: "bg-[#1e1e1e]",
  },
  { day: "20", classNames: "bg-[#1e1e1e]" },
  { day: "21", classNames: "bg-[#1e1e1e]" },
  { day: "22", classNames: "bg-[#1e1e1e]" },
  { day: "23", classNames: "bg-[#1e1e1e]" },
  {
    day: "24",
    classNames: "bg-[#1e1e1e] cursor-pointer",
    subscriptions: [
      {
        name: "LinkedIn",
        logo: "/linkedin.svg",
        payment: 8.99,
        total: 107.88,
        since: "2022-11-01",
        every: "Every 24th",
        color: "#0077B5",
      },
    ],
    modalXPosition: "right",
  },
  { day: "25", classNames: "bg-[#1e1e1e]" },
  { day: "26", classNames: "bg-[#1e1e1e]" },
  {
    day: "27",
    classNames: "bg-[#1e1e1e] cursor-pointer",
    subscriptions: [
      {
        name: "Netflix",
        logo: "/netflix.svg",
        payment: 4.33,
        total: 52,
        since: "2021-01-01",
        every: "Every 07th",
        color: "#E50914",
      },
    ],
    modalXPosition: "left",
  },
  { day: "28", classNames: "bg-[#1e1e1e]" },
  {
    day: "29",
    classNames: "bg-[#1e1e1e]",
  },
  {
    day: "30",
    classNames: "bg-[#1e1e1e] cursor-pointer",
    subscriptions: [
      {
        name: "Amazon",
        logo: "/amazon.svg",
        payment: 3.45,
        total: 41.4,
        since: "2023-01-01",
        every: "Every 30th",
        color: "#FF9900",
      },
      {
        name: "Godaddy",
        logo: "/godaddy.svg",
        payment: 3.99,
        total: 47.88,
        since: "2023-01-01",
        every: "Every 30th",
        color: "#FF69B4",
      },
    ],
  },
  { day: "+1", classNames: "bg-zinc-700/20 opacity-40" },
  { day: "+2", classNames: "bg-zinc-700/20 opacity-40" },
];

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
