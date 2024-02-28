const Header = ({ header }) => {
  return <h3>{header.name}</h3>;
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
      <br></br>
      <h5> Total of {totalExercises} exercises</h5>
    </>
  );
};

const Course = (props) => {
  return (
    <>
      <Header header={props.course} />
      <Content content={props.course.parts} />
    </>
  );
};

const App = () => {
  const course = {
    id: 1,
    name: "Half Stack application development",
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
    ],
  };

  return <Course course={course} />;
};

export default App;
