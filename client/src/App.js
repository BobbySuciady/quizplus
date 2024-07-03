import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import StudentLogin from './pages/StudentLogin';
import StudentHome from './pages/StudentHome';
import StudentSignup from './pages/StudentSignup';
import TeacherLogin from './pages/TeacherLogin';
import TeacherHome from './pages/TeacherHome';
import CreateQuiz from './pages/CreateQuiz';

function App() {
  
  return (

    <div>
    {/* Routes */}
    <Router>
      <Routes>
        <Route>
          <Route path='/:id' element={<StudentHome />}/>
          <Route path='/login' element={<StudentLogin />} />
          <Route path='/signup' element={<StudentSignup />} />
          <Route path='/teacher/login' element={<TeacherLogin/>}/>
          <Route path='/teacher/:id' element={<TeacherHome/>}/>
          <Route path='/createquiz' element={<CreateQuiz/>}/>
        </Route>
      </Routes>
    </Router>

    </div>
  );
}

export default App;
