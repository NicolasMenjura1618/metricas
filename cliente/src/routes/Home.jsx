import React from 'react';
import Header from '../components/Header';
import AddCancha from '../components/AddCancha';
import ListaCancha from '../components/ListaCancha';

const Home = () => {
  return (
    <>
      <Header />
      <main className="container mt-4">
        <AddCancha />
        <ListaCancha />
      </main>
    </>
  );
};

export default Home;
