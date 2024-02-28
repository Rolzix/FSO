const Header = ({ header }) => {
  return <h3>{header}</h3>;
};

const Content = ({ content }) => {
  const courseInfo = content.map((part) => (
    <div key={part.id}>
      {part.name} {part.exercises}
    </div>
  ));
  const totalExercises = content.reduce((acc, part) => acc + part.exercises, 0);
  console;
  return (
    <>
      {courseInfo}
      <h5> Total of {totalExercises} exercises</h5>
    </>
  );
};

const Course = (props) => {
  const courses = props.course.map((course) => (
    <>
      <Header header={course.name} />
      <Content content={course.parts} />
    </>
  ));

  return <>{courses}</>;
};

const App = () => {
  const courses = [
    {
      name: "Half Stack application development",
      id: 1,
      parts: [
        {
          name: "Fundamentals of React",
          exercises: 10,
          id: 1,
        },
        {
          name: "Using props to pass data",
          exercises: 7,
          id: 2,
        },
        {
          name: "State of a component",
          exercises: 14,
          id: 3,
        },
        {
          name: "Redux",
          exercises: 11,
          id: 4,
        },
      ],
    },
    {
      name: "Node.js",
      id: 2,
      parts: [
        {
          name: "Routing",
          exercises: 3,
          id: 1,
        },
        {
          name: "Middlewares",
          exercises: 7,
          id: 2,
        },
      ],
    },
  ];

  return <Course course={courses} />;
};

export default App;
