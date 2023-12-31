import { useState } from "react";
import { useEffect } from "react";
import personService from "./services/persons";
import "./index.css";

const Contact = ({ contact, onDeleteContact }) => (
  <div>
    {contact.name} {contact.number}
    <button onClick={onDeleteContact}>Delete</button>
  </div>
);

const ContactList = ({ contacts, onDeleteContact }) => {
  return contacts.map((contact) => (
    <Contact
      key={contact.id}
      contact={contact}
      onDeleteContact={() => onDeleteContact(contact)}
    />
  ));
};

const FilterForm = ({ query, setQuery }) => {
  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <form>
      <div>
        filter shown with <input value={query} onChange={handleQueryChange} />
      </div>
    </form>
  );
};

const NewContactForm = ({
  newName,
  handleNoteChange,
  newNumber,
  handleNumberChange,
  handleAddClick,
}) => {
  return (
    <form>
      <div>
        name: <input value={newName} onChange={handleNoteChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit" onClick={handleAddClick}>
          add
        </button>
      </div>
    </form>
  );
};

const Notification = ({ message, error }) => {
  if (message == null) {
    return null;
  }
  if (error) {
    return <div className="error">{message}</div>;
  }
  return <div className="notification">{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filterQuery, setFilterQuery] = useState("");
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    personService
      .getAll()
      .then((response) => {
        setPersons(response);
      })
      .catch((error) => {
        displayAndDisappearNotification("Connection Error", true);
      });
  }, []);

  const deleteContact = (contact) => {
    if (window.confirm(`Delete ${contact.name}?`)) {
      personService.deletePerson(contact.id);
      setPersons(persons.filter((person) => person.id != contact.id));
    }
  };

  const filterContacts = () => {
    return persons.filter((contact) => {
      return contact.name.toLowerCase().includes(filterQuery.toLowerCase());
    });
  };

  const contactExists = (contact) =>
    persons.find((element) => element.name == contact.name);

  const displayAndDisappearNotification = (msg, error) => {
    setMessage(msg);
    setError(error);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const handleAddClick = (event) => {
    event.preventDefault();
    const newContact = {
      name: newName,
      number: newNumber,
    };
    const exists = contactExists(newContact);
    if (exists) {
      if (
        window.confirm(
          `${newContact.name} is already added to phonebook, replace the old one with a new one?`
        )
      ) {
        personService
          .update(exists.id, newContact)
          .then((response) => {
            setPersons(
              persons.map((person) => {
                return person.id != response.id ? person : response;
              })
            );
            setNewName("");
            setNewNumber("");
            displayAndDisappearNotification(
              `Changed ${newContact.name} number to ${newContact.number}`,
              false
            );
          })
          .catch((error) => {
            if (error.response.status === 404) {
              setPersons(
                persons.filter((person) => person.name != newContact.name)
              );
              setNewName("");
              setNewNumber("");
              displayAndDisappearNotification(
                `Information about ${newContact.name} has already been removed from server`,
                true
              );
            } else {
              displayAndDisappearNotification(error.response.data.error, true);
            }
          });
      }
    } else {
      personService
        .createPerson(newContact)
        .then((response) => {
          setPersons(persons.concat(response));
          setNewName("");
          setNewNumber("");
          displayAndDisappearNotification(`Added ${newContact.name}`, false);
        })
        .catch((error) => {
          displayAndDisappearNotification(error.response.data.error, true);
        });
    }
  };

  const handleNoteChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification error={error} message={message} />
      <FilterForm query={filterQuery} setQuery={setFilterQuery} />
      <h2>Add New Note</h2>
      <NewContactForm
        handleAddClick={handleAddClick}
        handleNoteChange={handleNoteChange}
        handleNumberChange={handleNumberChange}
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <ContactList
        onDeleteContact={deleteContact}
        contacts={filterContacts()}
      />
    </div>
  );
};

export default App;
