-- Seed ticket types
INSERT INTO tickets (type, price, description) VALUES
('adult', 25.00, 'Adult admission (16+ years)'),
('child', 15.00, 'Child admission (3-15 years)'),
('senior', 20.00, 'Senior admission (65+ years)'),
('student', 18.00, 'Student admission (with valid ID)');

-- Seed hotels
INSERT INTO hotels (name, description, image_url) VALUES
('Safari Lodge', 'Experience the wild in comfort at our Safari Lodge, surrounded by exotic animals and nature.', '/uploads/safari-lodge.jpg'),
('Jungle Retreat', 'Immerse yourself in a tropical paradise at our Jungle Retreat with stunning views of the rainforest exhibit.', '/uploads/jungle-retreat.jpg'),
('Arctic Inn', 'Cool down at our Arctic Inn, located near our polar exhibit with views of penguins and polar bears.', '/uploads/arctic-inn.jpg');

-- Seed room types for Safari Lodge (hotel_id = 1)
INSERT INTO room_types (hotel_id, name, description, price_per_night, total_rooms) VALUES
(1, 'Single Room', 'Cozy single room with savanna view', 120.00, 10),
(1, 'Double Room', 'Spacious double room with balcony overlooking the safari', 180.00, 8),
(1, 'Family Suite', 'Large suite perfect for families, includes separate living area', 280.00, 4);

-- Seed room types for Jungle Retreat (hotel_id = 2)
INSERT INTO room_types (hotel_id, name, description, price_per_night, total_rooms) VALUES
(2, 'Single Room', 'Comfortable single room with rainforest ambiance', 110.00, 12),
(2, 'Double Room', 'Double room with floor-to-ceiling jungle views', 170.00, 10),
(2, 'Treehouse Suite', 'Elevated suite with panoramic views of the canopy', 320.00, 3);

-- Seed room types for Arctic Inn (hotel_id = 3)
INSERT INTO room_types (hotel_id, name, description, price_per_night, total_rooms) VALUES
(3, 'Single Room', 'Modern single room with polar exhibit views', 130.00, 8),
(3, 'Double Room', 'Double room with heated floors and northern lights themed decor', 190.00, 6),
(3, 'Ice Palace Suite', 'Premium suite with private viewing of the polar bear habitat', 350.00, 2)
