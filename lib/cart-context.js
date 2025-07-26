'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [cartCount, setCartCount] = useState(0)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart)
        setCartItems(parsed)
        updateCartCount(parsed)
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Update cart count
  const updateCartCount = (items) => {
    const count = items.reduce((total, item) => total + item.quantity, 0)
    setCartCount(count)
  }

  // Add item to cart
  const addToCart = (item) => {
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id)
    let updatedCart

    if (existingItemIndex > -1) {
      // If item exists, increase quantity
      updatedCart = cartItems.map((cartItem, index) => 
        index === existingItemIndex 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    } else {
      // If item doesn't exist, add new item
      updatedCart = [...cartItems, { ...item, quantity: 1, addedAt: new Date().toISOString() }]
    }

    setCartItems(updatedCart)
    updateCartCount(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    
    return true
  }

  // Remove item from cart
  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId)
    setCartItems(updatedCart)
    updateCartCount(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  // Update item quantity
  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId)
      return
    }

    const updatedCart = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    )
    
    setCartItems(updatedCart)
    updateCartCount(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  // Clear cart
  const clearCart = () => {
    setCartItems([])
    setCartCount(0)
    localStorage.removeItem('cart')
  }

  // Get total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      // Gunakan jumlah (total value) dari database, bukan hargaSatuan * quantity
      const itemTotal = item.jumlah ? (item.jumlah * item.quantity) : (item.hargaSatuan * item.quantity)
      return total + itemTotal
    }, 0)
  }

  const value = {
    cartItems,
    cartCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
