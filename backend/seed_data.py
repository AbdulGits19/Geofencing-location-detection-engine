import requests
import time

BASE_URL = "http://localhost:8000"

# Seeding only NEW users (IDs 2 through 6)
users_data = [
    {"username": "Prasad", "email": "prasad@example.com"},
    {"username": "Matthews", "email": "matthews@example.com"},
    {"username": "Karun", "email": "karun@example.com"},
    {"username": "Snigdha", "email": "snigdha@example.com"},
    {"username": "Prathyusha", "email": "prathyusha@example.com"}
]

# Seeding only NEW devices mapped to the new users
devices_data = [
    {"name": "Samsung Galaxy S24 Ultra", "user_id": 2},
    {"name": "OnePlus 12", "user_id": 3},
    {"name": "Google Pixel 8 Pro", "user_id": 4},
    {"name": "iPhone 15 Pro Max", "user_id": 5},
    {"name": "Nothing Phone 2", "user_id": 6}
]

# Seeding only NEW geofences (Omitting Madhapur)
geofences_data = [
    # 2. CHN - Polygon (4-point boundary around TIDEL Park)
    {"name": "TIDEL Park Polygon (CHN)", "type": "polygon", "is_enabled": True, "points": [
        {"latitude": 12.9890, "longitude": 80.2480, "sequence": 1},
        {"latitude": 12.9910, "longitude": 80.2480, "sequence": 2},
        {"latitude": 12.9910, "longitude": 80.2500, "sequence": 3},
        {"latitude": 12.9890, "longitude": 80.2500, "sequence": 4}
    ]},
    
    # 3. CBE - Circle
    {"name": "VOC Park (CBE)", "type": "circle", "radius": 400, "is_enabled": True, "points": [{"latitude": 11.0028, "longitude": 76.9660, "sequence": 1}]},
    
    # 4. VZG - Polygon (4-point boundary around Rushikonda IT Hill)
    {"name": "Rushikonda Tech Polygon (VZG)", "type": "polygon", "is_enabled": True, "points": [
        {"latitude": 17.7800, "longitude": 83.3850, "sequence": 1},
        {"latitude": 17.7840, "longitude": 83.3850, "sequence": 2},
        {"latitude": 17.7840, "longitude": 83.3900, "sequence": 3},
        {"latitude": 17.7800, "longitude": 83.3900, "sequence": 4}
    ]},
    
    # 5. BLR - Polygon (4-point boundary around E-City Phase 1)
    {"name": "E-City Campus Polygon (BLR)", "type": "polygon", "is_enabled": True, "points": [
        {"latitude": 12.8430, "longitude": 77.6580, "sequence": 1},
        {"latitude": 12.8480, "longitude": 77.6580, "sequence": 2},
        {"latitude": 12.8480, "longitude": 77.6630, "sequence": 3},
        {"latitude": 12.8430, "longitude": 77.6630, "sequence": 4}
    ]},

    # 6. NLR - Circle (VRC Centre)
    {"name": "VRC Centre (NLR)", "type": "circle", "radius": 600, "is_enabled": True, "points": [{"latitude": 14.4426, "longitude": 79.9772, "sequence": 1}]}
]

# Telemetry for all devices (1 through 6)
locations_data = [
    # Device 1 (HYD - Existing Madhapur Zone): Outside -> Inside -> Outside (ENTER, EXIT)
    {"device_id": 1, "latitude": 17.4326, "longitude": 78.4071},
    {"device_id": 1, "latitude": 17.4485, "longitude": 78.3912},
    {"device_id": 1, "latitude": 17.4843, "longitude": 78.3888},
    
    # Device 2 (CHN Polygon): Outside -> Inside (ENTER)
    {"device_id": 2, "latitude": 12.9870, "longitude": 80.2450}, 
    {"device_id": 2, "latitude": 12.9900, "longitude": 80.2490}, 
    
    # Device 3 (CBE Circle): Inside -> Outside (EXIT)
    {"device_id": 3, "latitude": 11.0029, "longitude": 76.9661}, 
    {"device_id": 3, "latitude": 11.0150, "longitude": 76.9700}, 

    # Device 4 (VZG Polygon): Outside -> Inside (ENTER)
    {"device_id": 4, "latitude": 17.7750, "longitude": 83.3800}, 
    {"device_id": 4, "latitude": 17.7820, "longitude": 83.3870}, 

    # Device 5 (BLR Polygon): Outside -> Outside (NO EVENTS)
    {"device_id": 5, "latitude": 12.8350, "longitude": 77.6500},
    {"device_id": 5, "latitude": 12.8360, "longitude": 77.6510},
    
    # Device 6 (NLR Circle): Inside -> Inside (NO EVENTS)
    {"device_id": 6, "latitude": 14.4430, "longitude": 79.9775},
    {"device_id": 6, "latitude": 14.4428, "longitude": 79.9773},
]

def seed():
    print("Seeding New Users...")
    for u in users_data:
        requests.post(f"{BASE_URL}/users/", json=u)
        
    print("Seeding New Devices...")
    for d in devices_data:
        requests.post(f"{BASE_URL}/devices/", json=d)
        
    print("Seeding New Geofences...")
    for g in geofences_data:
        requests.post(f"{BASE_URL}/geofences/", json=g)
        
    print("Simulating Location Telemetry...")
    for loc in locations_data:
        res = requests.post(f"{BASE_URL}/locations/", json=loc)
        events = res.json()
        if events:
            for e in events:
                print(f"  -> Triggered {e['event_type']} for Device {e['device_id']}")
        time.sleep(0.5) 

    print("Seed complete.")

if __name__ == "__main__":
    seed()