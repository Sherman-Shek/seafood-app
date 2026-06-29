// src/router.js
import React from 'react'
import { Route } from 'react-router-dom'

export default (
  <Route>
    <Route path="/en/" />
    <Route path="/zh/" />
    <Route path="/en/seafood/:id" />
    <Route path="/zh/seafood/:id" />
    <Route path="/en/cart" />
    <Route path="/en/orders" />
  </Route>
)