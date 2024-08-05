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
    <div key={course.id}>
      <Header header={course.name} />
      <Content content={course.parts} />
    </div>
  ));

  return <>{courses}</>;
};

export default Course;
