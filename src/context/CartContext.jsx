import React, { createContext, useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('gadgetCart')
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart)
        setCartItems(parsed)
      } catch (error) {
        console.error('Error loading cart:', error)
        setCartItems([])
      }
    }
  }, [])

  // Update totals function - defined before useEffect that uses it
  const updateTotals = useCallback(() => {
    const items = cartItems.reduce((acc, item) => acc + item.quantity, 0)
    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    setTotalItems(items)
    setTotalPrice(total)
  }, [cartItems])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gadgetCart', JSON.stringify(cartItems))
    updateTotals()
  }, [cartItems, updateTotals])

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id)
      
      if (existingItem) {
        toast.success(`Added another ${product.name} to cart!`)
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      
      toast.success(`${product.name} added to cart!`)
      return [...prevItems, { ...product, quantity }]
    })
  }, [])

  const removeFromCart = useCallback((productId) => {
    setCartItems(prevItems => {
      const item = prevItems.find(item => item.id === productId)
      if (item) {
        toast.error(`${item.name} removed from cart`)
      }
      return prevItems.filter(item => item.id !== productId)
    })
  }, [])

  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }, [removeFromCart])

  const clearCart = useCallback(() => {
    setCartItems([])
    toast.success('Cart cleared')
  }, [])

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }, [cartItems])

  const getItemCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }, [cartItems])

  const toggleCart = useCallback(() => {
    setIsCartOpen(prev => !prev)
  }, [])

  const closeCart = useCallback(() => {
    setIsCartOpen(false)
  }, [])

  const openCart = useCallback(() => {
    setIsCartOpen(true)
  }, [])

  const value = {
    cartItems,
    isCartOpen,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
    toggleCart,
    closeCart,
    openCart,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}