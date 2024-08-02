import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import { base_url } from "../../const";
import CustomInput from "../../components/input";
import UserFrom from "./Usersform";
import UsersTable from "./UsersTable";

const Users = () => {
  const [showForm, setShowForm] = useState(false);
  const [companyId, setCompanyId] = useState("");
  const [name, setName] = useState("");
  const [users, setUsers] = useState([]);
  const [companyRefresh, setCompanyRefresh] = useState(false);

  const handleShowForm = () => {
    setShowForm(!showForm);
  };


  const fetchUsers = async () => {
    try {
      const response = await axios.post(`${base_url}/users/filter`, {
        name: name,
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching Users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [name]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${base_url}/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto my-6">
        <div className="flex flex-row my-3 gap-4 ">
          <div className="flex items-center ">
            <CustomInput
              id="company"
              label="Name"
              className="shadow-sm"
              value={name}
              type="text"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
              labelStyles={{
                fontWeight: 500,
              }}
            />
          </div>

        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <label
            htmlFor="Table"
            className="block mb-2 text-xl font-medium text-gray-900 ps-2 pt-4"
          >
            Users
          </label>
          <div>
            <Button
              variant="text"
              sx={{
                margin: ".7em",
                bgcolor: "teal",
                color: "white",
                "&:hover": {
                  bgcolor: "teal",
                  color: "white",
                  boxShadow: "1px 2px 3px gray",
                },
              }}
              onClick={handleShowForm}
            >
              Add USers
            </Button>
            {(showForm || companyId) && (
              <Button
                variant="text"
                sx={{
                  margin: ".7em",
                  bgcolor: "red",
                  color: "white",
                  "&:hover": {
                    bgcolor: "white",
                    boxShadow: "1px 2px 3px gray",
                    color: "red",
                  },
                }}
                onClick={() => {
                  setCompanyId("");
                  setShowForm(false);
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
        {showForm || companyId ? (
          <div className="justify-center">
            <UserFrom
              {...{
                companyId,
                setCompanyId,
                setShowForm,
                showForm,
                setCompanyRefresh,
                companyRefresh,
                fetchUsers,
              }}
            />
          </div>
        ) : (
          ""
        )}

        <div className="bg-white rounded-lg shadow-md">
          <UsersTable
            {...{
              setCompanyId,
              companyRefresh,
              name,
              handleDelete,
              users,
            }}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Users;
