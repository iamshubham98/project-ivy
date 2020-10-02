import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { firestore, auth } from '../firebase';
import './Navbar.css';

function Navbar(props) {
  const { channelData } = props;
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const [userAttendance, setUserAttendance] = useState('');
  const [attendance, setAttendance] = useState([]);

  const handleChange = (event) => {
    setUserAttendance(event.target.value);
  };

  function fetchAttendance() {
    if (!channelData) return;
    const d = new Date().getTime();

    firestore
      .collection('attendances')
      .where('channel', '==', channelData)
      .orderBy('created_at', 'asc')
      .get()
      .then((snapshot) => {
        // const channels = snapshot.docs;
        const attendance = snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        setAttendance(attendance);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleSubmit(e) {
    if (userAttendance && channelData) {
      e.preventDefault();
      const data = {
        from: {
          id: auth.currentUser.uid,
          name: auth.currentUser.displayName,
        },
        channel: channelData,
        created_at: new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: 'long',
          hour: '2-digit',
          minute: '2-digit',
        }),
        response: userAttendance,
      };
      firestore.collection('attendances').add(data);
      /*.then((data) => {
          setUserMessage('');
          fetchMessages();
          });*/

      setAttendance({
        attend: '',
      });
      showSidebar();
    }
  }

  return (
    <>
      <div className="navbar">
        <Link to="#" className="menu-bars">
          <FaIcons.FaBars onClick={showSidebar} />
        </Link>
      </div>
      <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
        <ul className="nav-menu-items">
          <div>
            <h2>Attendance</h2>
            <form>
              <label className="radio-inline">
                <input
                  type="radio"
                  name="attend"
                  value="Present"
                  onChange={handleChange}
                />
                Present
              </label>
              <br />
              <br />
              <label className="radio-inline">
                <input
                  type="radio"
                  name="attend"
                  value="Absent"
                  onChange={handleChange}
                />
                Absent
              </label>
              <br />
              <br />
              <br />
              <label className="button-1">
                <input type="button" value="Submit" onClick={handleSubmit} />
              </label>
            </form>
            <br />
            <br />
            <br />
            <label className="button-2">
              <input
                type="button"
                value="Show Attendance"
                onClick={fetchAttendance}
              />
            </label>
            <div className="attendance-list">
              {attendance.map((attendList) => (
                <div key={attendList.id}>
                  {attendList.from.name}&nbsp;&nbsp;
                  {attendList.created_at}
                </div>
              ))}

              {attendance.length === 0 && (
                <div style={{ textAlign: 'center', marginTop: 20 }}>
                  No attendance here!
                </div>
              )}
            </div>
          </div>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
