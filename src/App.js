import { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";

function Row({
  user = {},
  setDeleteUsers,
  deleteUsers,
  deleterow = () => {},
  editUser
}) {
  const [checked, setChecked] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);

  return (
    <tr>
      <td>
        <input
          className="form-check-input "
          type="checkbox"
          value=""
          id="flexCheckDefault"
          onClick={() => {
            let arr = deleteUsers;
            if (checked) {
              arr.push(user);
              setDeleteUsers(arr);
            } else {
              setDeleteUsers(arr.filter((u) => u.id !== user.id));
            }
            setChecked(!checked);
            console.log("new delete users:", deleteUsers);
          }}
        />
      </td>
      {enabled && (
        <td>
          <input
            type="email"
            class="form-control form-control-sm"
            id="user-name"
            aria-describedby="emailHelp"
            placeholder={user.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </td>
      )}
      {!enabled && <td>{user.name}</td>}
      {enabled && (
        <td>
          <input
            type="email"
            class="form-control form-control-sm"
            id="user-name"
            aria-describedby="emailHelp"
            placeholder={user.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </td>
      )}
      {!enabled && <td>{user.email}</td>}
      {enabled && (
        <td>
          <input
            type="email"
            class="form-control form-control-sm"
            id="user-name"
            aria-describedby="emailHelp"
            placeholder={user.role}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </td>
      )}
      {!enabled && <td>{user.role}</td>}
      <td>
        <div className="btn-group btn-group-sm">
          {enabled && (
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => {
                setEnabled(!enabled);
                editUser(user.id, name, email, role);
              }}
            >
              save
            </button>
          )}
          {!enabled && (
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => {
                setEnabled(!enabled);
              }}
            >
              edit
            </button>
          )}
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={deleterow}
          >
            delete
          </button>
        </div>
      </td>
    </tr>
  );
}

function Table({ rows }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col"></th>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Role</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function Pagenation({ pages, currentPage, setCurrentPage, handleClick }) {
  return (
    <nav aria-label="Page navigation " className="pagenate">
      <ul className="pagination justify-content-center">
        <li
          key={"first"}
          className="page-item"
          onClick={() => setCurrentPage(1)}
        >
          <a className="page-link" href="#">
            First
          </a>
        </li>
        <li
          key={0}
          className="page-item"
          onClick={() =>
            setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)
          }
        >
          <a className="page-link" href="#">
            &#8678;
          </a>
        </li>
        {Array.from({ length: pages }).map((item, index) => (
          <li
            key={index + 2}
            className="page-item "
            onClick={() => handleClick(index + 1)}
          >
            <a
              className={
                index + 1 === currentPage ? "page-link selected" : "page-link"
              }
              href="#"
            >
              {index + 1}
            </a>
          </li>
        ))}

        <li
          key={769}
          className="page-item"
          onClick={() =>
            setCurrentPage(currentPage < pages ? currentPage + 1 : currentPage)
          }
        >
          <a className="page-link" href="#">
            &#8680;
          </a>
        </li>
        <li
          key={770}
          className="page-item"
          onClick={() => setCurrentPage(pages)}
        >
          <a className="page-link" href="#">
            Last
          </a>
        </li>
      </ul>
    </nav>
  );
}

function SearchBar({
  users,
  searchText,
  setSearch,
  setSearchText,
  setPages,
  setCurrentPage
}) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search users"
        className="input-box"
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          if (e.target.value) {
            const temp = users.filter(
              (user) =>
                user.name
                  .toLowerCase()
                  .includes(e.target.value.toLowerCase()) ||
                user.email
                  .toLowerCase()
                  .includes(e.target.value.toLowerCase()) ||
                user.role.toLowerCase().includes(e.target.value.toLowerCase())
            );

            setSearch(temp);
            setPages(Math.ceil(temp.length / 10));
            setCurrentPage(1);
          } else {
            console.log("search bar cleared!");
            setSearch(users);
            setPages(Math.ceil(users.length / 10));
            setCurrentPage(1);
          }
        }}
      />
    </div>
  );
}
export default function App() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState(users);
  const [searchText, setSearchText] = useState("");
  const [deleteUsers, setDeleteUsers] = useState([]);
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const lastUserIndex = currentPage * 10;
  const firstUserIndex = lastUserIndex - 10;
  const currentUsers = search.slice(firstUserIndex, lastUserIndex);

  console.log("user to delete", deleteUsers);
  console.log("pages", pages);
  console.log("total users", users.length);

  useEffect(() => {
    function getData() {
      axios(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      ).then((data) => {
        setUsers(data.data);
        setSearch(data.data);
        setPages(Math.ceil(data.data.length / 10));
      });
    }
    getData();
  }, []);

  function editUser(id, name, email, role) {
    let temp = users;
    let user = temp.find((user) => user.id === id);
    user.name = name;
    user.email = email;
    user.role = role;
    setUsers(temp);
    setSearch(temp);
    const temp2 = temp.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase()) ||
        user.role.toLowerCase().includes(searchText.toLowerCase())
    );
    setSearch(temp2);
    setPages(Math.ceil(temp2.length / 10));
  }

  function deleterow(user, search) {
    const temp = users.filter((u) => u.id !== user.id);
    const temp2 = search.filter((u) => u.id !== user.id);
    setUsers(temp);
    setSearch(temp2);
    const pages = Math.ceil(temp2.length / 10);
    setPages(pages);
    if (currentPage - 1 === pages && temp2.length % 10 === 0) {
      setCurrentPage(currentPage - 1);
    }
  }

  return (
    <div className="App">
      <h1>
        <span class="badge badge-secondary"> Admin page</span>
      </h1>

      <SearchBar
        users={users}
        setSearch={setSearch}
        setPages={setPages}
        searchText={searchText}
        setCurrentPage={setCurrentPage}
        setSearchText={setSearchText}
      />
      <div className="container">
        <Table
          rows={currentUsers.map((user, index) => (
            <Row
              key={user.id}
              user={user}
              setDeleteUsers={setDeleteUsers}
              deleteUsers={deleteUsers}
              deleterow={() => {
                deleterow(user, search);
              }}
              editUser={editUser}
            />
          ))}
        />
      </div>
      <div className="footer">
        <Pagenation
          pages={pages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          handleClick={(page) => setCurrentPage(page)}
        />
        <button
          type="button"
          className="btn btn-outline-danger selected-delete"
          onClick={() => {
            if (deleteUsers.length !== 0) {
              const temp = users.filter((user) => {
                return !deleteUsers.find(
                  (deleteuser) => deleteuser.id === user.id
                );
              });
              const temp2 = temp.filter(
                (user) =>
                  user.name.toLowerCase().includes(searchText.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchText.toLowerCase()) ||
                  user.role.toLowerCase().includes(searchText.toLowerCase())
              );
              setSearch(temp2);
              setUsers(temp);
              setPages(Math.ceil(temp2.length / 10));
              console.log("curr", currentPage - 1, pages, temp2.length % 10);
              if (currentPage === pages && temp2.length % 10 === 0) {
                setCurrentPage(currentPage - 1);
              }
              setDeleteUsers([]);
            }
          }}
        >
          delete selected
        </button>
      </div>
    </div>
  );
}
