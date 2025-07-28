'use client'

import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

// Custom hook untuk mengelola cart dengan database
export function useCartDB() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sessionId, setSessionId] = useState(null)

  // Initialize session ID
  useEffect(() => {
    // Clear any old localStorage cart data
    localStorage.removeItem('cart')
    localStorage.removeItem('cartItems')
    
    let storedSessionId = localStorage.getItem('cart_session_id')
    console.log('Stored session ID:', storedSessionId)
    
    if (!storedSessionId) {
      storedSessionId = uuidv4()
      localStorage.setItem('cart_session_id', storedSessionId)
      console.log('Generated new session ID:', storedSessionId)
    }
    
    setSessionId(storedSessionId)
    console.log('Cart session initialized:', storedSessionId)
  }, [])

  // Listen for cartUpdated event and refetch cart when sessionId is available
  useEffect(() => {
    if (!sessionId) return;
    const handleCartUpdated = (event) => {
      // Only refetch if sessionId exists
      fetchCartItems();
    };
    window.addEventListener('cartUpdated', handleCartUpdated);
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdated);
    };
  }, [sessionId])

  // Fetch cart items when session ID is available
  useEffect(() => {
    if (sessionId) {
      fetchCartItems()
    }
  }, [sessionId])

  // Debug cartItems changes
  useEffect(() => {
    console.log('cartItems changed:', cartItems.length, cartItems)
  }, [cartItems])

  const fetchCartItems = async () => {
    if (!sessionId) return

    setLoading(true)
    setError(null)

    try {
      console.log('Fetching cart for session:', sessionId)
      const response = await fetch(`/api/cart?sessionId=${sessionId}`)
      const result = await response.json()
      console.log('Cart fetch result:', result)

      if (result.success) {
        const newItems = result.data.items || []
        setCartItems(newItems)
        console.log('Cart items set:', newItems)
        console.log('Cart items count after set:', newItems.length)
        
        // Broadcast cart update event for initial load
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cartUpdated', { 
            detail: { 
              items: newItems, 
              count: newItems.reduce((sum, item) => sum + item.quantity, 0) 
            }
          }))
        }
      } else {
        setError(result.error || 'Failed to fetch cart')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error fetching cart:', err)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (catalogueId, quantity = 1) => {
    if (!sessionId) return false

    setLoading(true)
    setError(null)

    try {
      console.log('Adding to cart:', { sessionId, catalogueId, quantity })
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          catalogueId,
          quantity
        })
      })

      const result = await response.json()
      console.log('Add to cart result:', result)

      if (result.success) {
        // Update local state immediately for better UX
        console.log('Before setCartItems - current items:', cartItems.length)
        console.log('New items from API:', result.data.items?.length || 0)
        const newItems = result.data.items || []
        setCartItems(newItems)
        console.log('Cart items updated immediately:', newItems)
        
        // Broadcast cart update event to all components
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cartUpdated', { 
            detail: { 
              items: newItems, 
              count: newItems.reduce((sum, item) => sum + item.quantity, 0) 
            }
          }))
        }
        
        return true
      } else {
        setError(result.error || 'Failed to add item to cart')
        return false
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error adding to cart:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (catalogueId, quantity) => {
    if (!sessionId) return false

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          catalogueId,
          quantity
        })
      })

      const result = await response.json()

      if (result.success) {
        // Update local state immediately for better UX
        const newItems = result.data.items || []
        setCartItems(newItems)
        console.log('Cart items updated after quantity change:', newItems)
        
        // Broadcast cart update event
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cartUpdated', { 
            detail: { 
              items: newItems, 
              count: newItems.reduce((sum, item) => sum + item.quantity, 0) 
            }
          }))
        }
        
        return true
      } else {
        setError(result.error || 'Failed to update cart')
        return false
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error updating cart:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  const removeFromCart = async (catalogueId) => {
    if (!sessionId) return false

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/cart?sessionId=${sessionId}&catalogueId=${catalogueId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        const newItems = result.data.items || []
        setCartItems(newItems)
        
        // Broadcast cart update event
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cartUpdated', { 
            detail: { 
              items: newItems, 
              count: newItems.reduce((sum, item) => sum + item.quantity, 0) 
            }
          }))
        }
        
        return true
      } else {
        setError(result.error || 'Failed to remove item from cart')
        return false
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error removing from cart:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  const clearCart = async () => {
    if (!sessionId) return false

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/cart?sessionId=${sessionId}&clearAll=true`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        const newItems = result.data.items || []
        setCartItems(newItems)
        
        // Broadcast cart update event
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('cartUpdated', { 
            detail: { items: newItems, count: 0 }
          }))
        }
        
        return true
      } else {
        setError(result.error || 'Failed to clear cart')
        return false
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error clearing cart:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.jumlah || item.hargaSatuan || 0
      const quantity = item.quantity || 0
      return total + (price * quantity)
    }, 0)
  }

  const getItemCount = () => {
    const count = cartItems.reduce((count, item) => count + (item.quantity || 0), 0)
    return count
  }

  return {
    cartItems,
    loading,
    error,
    sessionId,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCartItems,
    getTotalPrice,
    getItemCount,
    setError
  }
}
