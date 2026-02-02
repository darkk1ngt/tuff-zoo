-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    reset_token VARCHAR(255) NULL,
    reset_token_expires DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL UNIQUE,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT
);

-- Hotels table
CREATE TABLE IF NOT EXISTS hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500)
);

-- Room types table
CREATE TABLE IF NOT EXISTS room_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price_per_night DECIMAL(10, 2) NOT NULL,
    total_rooms INT NOT NULL DEFAULT 1,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    booking_type ENUM('ticket', 'hotel') NOT NULL,
    check_in DATE NULL,
    check_out DATE NULL,
    room_type_id INT NULL,
    ticket_id INT NULL,
    quantity INT DEFAULT 1,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    total_price DECIMAL(10, 2) NOT NULL,
    stripe_session_id VARCHAR(255) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE SET NULL,
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE SET NULL
);

-- Gallery images table
CREATE TABLE IF NOT EXISTS gallery_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    uploaded_by INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Schema migrations tracking table
CREATE TABLE IF NOT EXISTS schema_migrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
