import pandas as pd
import random
from pathlib import Path


# Make the results reproducible
random.seed(42)


# ---------------------------------------------------------
# DATASET CONFIGURATION
# ---------------------------------------------------------

EMERGENCY_TYPES = [
    "Fire",
    "Flood",
    "Accident",
    "Medical",
    "Crime",
    "Earthquake",
    "Storm",
    "Landslide",
    "Other"
]

PRIORITIES = [
    "Low",
    "Medium",
    "High",
    "Critical"
]


# ---------------------------------------------------------
# WORDS / PHRASES USED TO CREATE VARIED DESCRIPTIONS
# ---------------------------------------------------------

locations = [
    "near the main road",
    "near the railway station",
    "in the residential area",
    "near the market",
    "near the school",
    "near the hospital",
    "in the city center",
    "near the bus stand",
    "in a residential building",
    "near the highway",
    "near the bridge",
    "in the nearby village",
    "near the office area",
    "in a crowded street",
    "near the shopping complex"
]

times = [
    "a few minutes ago",
    "about ten minutes ago",
    "around twenty minutes ago",
    "less than one hour ago",
    "earlier today",
    "during the morning",
    "during the afternoon",
    "during the evening",
    "during the night"
]

people = [
    "one person",
    "two people",
    "several people",
    "a family",
    "multiple residents",
    "several commuters",
    "nearby residents"
]


# ---------------------------------------------------------
# DESCRIPTION TEMPLATES
# ---------------------------------------------------------

templates = {

    "Fire": {
        "Low": [
            "A small fire was noticed in {location} {time}. Smoke is visible but the situation appears contained.",
            "A minor fire started in {location} {time}. Nearby residents are monitoring the situation.",
            "A small electrical fire was reported {location} {time}. No injuries have been reported.",
            "Smoke and a small flame were noticed {location} {time}. The fire has not spread.",
            "A minor fire incident occurred {location} {time}. People nearby have moved away from the area."
        ],

        "Medium": [
            "A fire has started {location} {time}. Flames are visible and nearby people are moving away.",
            "A moderate fire was reported {location} {time}. The fire is spreading slowly.",
            "A shop fire was reported {location} {time}. Smoke is increasing and assistance is needed.",
            "An electrical fire is burning {location} {time}. Nearby residents are requesting help.",
            "A fire has damaged part of a building {location} {time}. The situation requires attention."
        ],

        "High": [
            "A large fire is spreading rapidly {location} {time}. Several people are trying to evacuate.",
            "Heavy flames are coming from a building {location} {time}. Nearby residents need immediate assistance.",
            "A serious building fire was reported {location} {time}. Thick smoke is affecting the surrounding area.",
            "A large fire has spread to nearby rooms {location} {time}. Multiple people may be at risk.",
            "A vehicle and nearby structure are on fire {location} {time}. Emergency assistance is urgently needed."
        ],

        "Critical": [
            "A massive fire is spreading across several buildings {location} {time}. Many people are trapped inside.",
            "A building is fully engulfed in flames {location} {time}. People are trapped and require immediate rescue.",
            "A major fire with heavy smoke is threatening multiple buildings {location} {time}. Several people may be injured.",
            "A rapidly spreading fire has trapped residents {location} {time}. Immediate evacuation and rescue are required.",
            "A severe fire is out of control {location} {time}. Multiple buildings and people are in immediate danger."
        ]
    },

    "Flood": {
        "Low": [
            "Water has collected on the road {location} {time}, but traffic is still moving slowly.",
            "Minor waterlogging was reported {location} {time}. Residents are able to move around.",
            "Rainwater has entered a small part of the area {location} {time}. No injuries are reported.",
            "A shallow layer of water is covering the road {location} {time}.",
            "Drainage is blocked and water is accumulating {location} {time}. The situation is currently manageable."
        ],

        "Medium": [
            "Flood water has entered several streets {location} {time}. Movement is becoming difficult.",
            "Water levels have increased significantly {location} {time}. Residents are requesting assistance.",
            "Heavy rain has caused flooding {location} {time}. Several roads are partially blocked.",
            "Flood water has entered some houses {location} {time}. People are moving to safer areas.",
            "A moderate flood is affecting {location} {time}. Transportation is being disrupted."
        ],

        "High": [
            "Flood water is rising rapidly {location} {time}. Several homes are surrounded by water.",
            "A serious flood has affected {location} {time}. Residents are struggling to evacuate.",
            "Water has entered many buildings {location} {time}. Roads are no longer safe for vehicles.",
            "Flooding has cut off access to {location} {time}. Several residents need emergency assistance.",
            "Rapidly rising water is threatening homes {location} {time}. Immediate rescue support is needed."
        ],

        "Critical": [
            "Severe flooding has submerged multiple buildings {location} {time}. People are trapped and need rescue.",
            "Flood water has risen above dangerous levels {location} {time}. Several families are stranded.",
            "A major flood has completely blocked roads {location} {time}. Many residents require immediate evacuation.",
            "Rapid flooding has trapped people inside homes {location} {time}. Emergency rescue is urgently required.",
            "A large area is underwater {location} {time}. Multiple people are stranded and in immediate danger."
        ]
    },

    "Accident": {
        "Low": [
            "A minor road accident occurred {location} {time}. No serious injuries have been reported.",
            "A small vehicle collision happened {location} {time}. Traffic is moving slowly.",
            "Two vehicles had a minor collision {location} {time}. No one appears seriously injured.",
            "A motorcycle slipped and fell {location} {time}. The rider has minor injuries.",
            "A minor traffic accident was reported {location} {time}. Assistance may be needed."
        ],

        "Medium": [
            "A road accident involving two vehicles occurred {location} {time}. Some people have injuries.",
            "A vehicle collision has blocked part of the road {location} {time}. Injured people need assistance.",
            "A motorcycle and car collided {location} {time}. One person appears injured.",
            "A moderate traffic accident occurred {location} {time}. Medical assistance is requested.",
            "A vehicle crashed into another vehicle {location} {time}. Several people have minor injuries."
        ],

        "High": [
            "A serious road accident occurred {location} {time}. Several people are injured.",
            "A high-speed collision happened {location} {time}. Multiple injured people require medical help.",
            "A vehicle has overturned after an accident {location} {time}. People are trapped inside.",
            "A major collision is blocking the road {location} {time}. Several people need urgent assistance.",
            "A serious accident involving multiple vehicles occurred {location} {time}. Emergency support is needed."
        ],

        "Critical": [
            "A severe multi-vehicle accident occurred {location} {time}. Several people are critically injured.",
            "A major crash has left multiple people trapped {location} {time}. Immediate rescue is required.",
            "A high-speed accident has caused multiple serious injuries {location} {time}. Emergency medical support is urgently needed.",
            "Several vehicles were involved in a severe collision {location} {time}. Multiple victims require immediate rescue.",
            "A catastrophic road accident occurred {location} {time}. People are trapped and critically injured."
        ]
    },

    "Medical": {
        "Low": [
            "A person is feeling unwell {location} {time}. Basic medical assistance may be required.",
            "Someone reported mild illness {location} {time}. The person is conscious and stable.",
            "A person needs routine medical assistance {location} {time}. No immediate danger is reported.",
            "A resident is experiencing mild symptoms {location} {time}. Assistance is requested.",
            "A person requires basic first aid {location} {time}. The situation appears stable."
        ],

        "Medium": [
            "A person is experiencing severe pain {location} {time}. Medical assistance is needed.",
            "Someone has suddenly become ill {location} {time}. A medical team is requested.",
            "A person is having difficulty walking and needs medical assistance {location} {time}.",
            "A resident has suffered a moderate medical problem {location} {time}.",
            "A person needs urgent medical attention {location} {time} but is currently conscious."
        ],

        "High": [
            "A person has suffered a serious medical emergency {location} {time}. Immediate medical assistance is needed.",
            "Someone has collapsed {location} {time}. The person requires urgent medical attention.",
            "A person is experiencing severe breathing difficulty {location} {time}. Medical help is urgently needed.",
            "A serious medical condition was reported {location} {time}. Emergency assistance is required.",
            "A person is unconscious but breathing {location} {time}. Immediate medical support is needed."
        ],

        "Critical": [
            "A person is unconscious and not responding {location} {time}. Immediate emergency medical assistance is required.",
            "Someone is in a life-threatening medical condition {location} {time}. Urgent medical intervention is needed.",
            "A person has stopped responding {location} {time}. Immediate emergency medical support is required.",
            "A severe medical emergency has occurred {location} {time}. The victim is in critical condition.",
            "A person is experiencing a life-threatening emergency {location} {time}. Immediate medical rescue is needed."
        ]
    },

    "Crime": {
        "Low": [
            "A suspicious activity was noticed {location} {time}. No immediate threat has been reported.",
            "A possible theft was reported {location} {time}. The situation appears under control.",
            "Suspicious behavior was noticed {location} {time}. Residents are requesting police assistance.",
            "A minor property theft was reported {location} {time}.",
            "A suspicious person was seen {location} {time}. No violence has been reported."
        ],

        "Medium": [
            "A theft has been reported {location} {time}. Police assistance is requested.",
            "A person reported being threatened {location} {time}. Authorities are needed.",
            "A robbery attempt was reported {location} {time}. The suspect has left the area.",
            "A property break-in occurred {location} {time}. Police investigation is required.",
            "A dispute has escalated {location} {time}. Authorities are requested to control the situation."
        ],

        "High": [
            "An armed robbery was reported {location} {time}. People nearby are at risk.",
            "A violent incident has occurred {location} {time}. Police assistance is urgently required.",
            "A person was attacked {location} {time}. The suspect may still be nearby.",
            "A serious criminal incident was reported {location} {time}. Immediate police response is needed.",
            "A violent confrontation is taking place {location} {time}. Nearby people are in danger."
        ],

        "Critical": [
            "An armed attacker is threatening people {location} {time}. Immediate police intervention is required.",
            "A violent attack involving multiple people is occurring {location} {time}. People are in immediate danger.",
            "A serious armed crime has been reported {location} {time}. The suspect may still be dangerous.",
            "Multiple people are being threatened during a violent incident {location} {time}. Emergency police response is required.",
            "A life-threatening criminal attack is occurring {location} {time}. Immediate intervention is urgently needed."
        ]
    },

    "Earthquake": {
        "Low": [
            "A mild earthquake was felt {location} {time}. No damage has been reported.",
            "Light shaking was noticed {location} {time}. Residents report no injuries.",
            "A small earthquake was felt {location} {time}. Buildings appear unaffected.",
            "Minor ground shaking occurred {location} {time}. No major problems are visible.",
            "A weak earthquake was reported {location} {time}. The situation appears stable."
        ],

        "Medium": [
            "Moderate earthquake shaking was felt {location} {time}. Some objects have fallen.",
            "An earthquake caused minor damage {location} {time}. Residents need assistance.",
            "Strong shaking was reported {location} {time}. Some buildings have visible damage.",
            "An earthquake has damaged parts of buildings {location} {time}.",
            "Moderate earthquake activity affected {location} {time}. Roads may be partially blocked."
        ],

        "High": [
            "A strong earthquake has caused significant damage {location} {time}. Several buildings are affected.",
            "Heavy shaking damaged multiple structures {location} {time}. People need emergency assistance.",
            "A major earthquake has caused building damage {location} {time}. Some people may be trapped.",
            "Strong earthquake activity has blocked roads {location} {time}. Emergency response is needed.",
            "Several buildings were damaged by an earthquake {location} {time}. Residents are evacuating."
        ],

        "Critical": [
            "A major earthquake has collapsed buildings {location} {time}. People are trapped under debris.",
            "Severe earthquake damage has affected multiple buildings {location} {time}. Rescue teams are urgently needed.",
            "A powerful earthquake has caused widespread destruction {location} {time}. Many people may be trapped.",
            "Multiple structures have collapsed after a major earthquake {location} {time}. Immediate rescue is required.",
            "A severe earthquake has caused casualties and collapsed buildings {location} {time}. Emergency rescue is critical."
        ]
    },

    "Storm": {
        "Low": [
            "Strong winds are affecting {location} {time}. No major damage has been reported.",
            "Heavy rain and moderate winds were reported {location} {time}.",
            "A storm is passing through {location} {time}. Residents are advised to stay indoors.",
            "Moderate storm activity is affecting {location} {time}. No injuries are reported.",
            "Wind speeds have increased {location} {time}. Minor branches have fallen."
        ],

        "Medium": [
            "Strong winds and heavy rain are affecting {location} {time}. Some roads are blocked.",
            "A storm has damaged trees {location} {time}. Residents need assistance.",
            "Heavy rainfall and strong winds are disrupting transportation {location} {time}.",
            "A moderate storm has damaged property {location} {time}. Emergency assistance is requested.",
            "Storm conditions are worsening {location} {time}. Several areas are experiencing power problems."
        ],

        "High": [
            "A severe storm is causing major damage {location} {time}. Several roads are blocked.",
            "Strong winds have damaged buildings and trees {location} {time}. People need assistance.",
            "A powerful storm is affecting {location} {time}. Residents are being advised to evacuate.",
            "Severe weather has caused power failures and property damage {location} {time}.",
            "A strong storm has made roads dangerous {location} {time}. Emergency response is required."
        ],

        "Critical": [
            "A violent storm is causing widespread destruction {location} {time}. People are trapped in damaged buildings.",
            "Extreme winds and heavy rain are threatening residents {location} {time}. Immediate evacuation is required.",
            "A severe storm has destroyed buildings and blocked roads {location} {time}. Multiple people need rescue.",
            "A major storm has caused widespread damage and injuries {location} {time}. Emergency rescue is urgently needed.",
            "Extreme storm conditions have put many residents in immediate danger {location} {time}."
        ]
    },

    "Landslide": {
        "Low": [
            "A small amount of soil has fallen near {location} {time}. The road remains partially usable.",
            "Minor rockfall was reported {location} {time}. No injuries are known.",
            "Loose soil has moved onto the roadside {location} {time}.",
            "A small landslide has affected the edge of the road {location} {time}.",
            "Minor debris was found near {location} {time}. The situation is currently manageable."
        ],

        "Medium": [
            "A landslide has blocked part of the road {location} {time}. Assistance is required.",
            "Moderate soil movement was reported {location} {time}. Traffic is being disrupted.",
            "A landslide has deposited debris on the road {location} {time}.",
            "Several rocks and soil have fallen near {location} {time}. Residents are requesting assistance.",
            "A moderate landslide has affected access to {location} {time}."
        ],

        "High": [
            "A large landslide has blocked the main road {location} {time}. Several people are stranded.",
            "Heavy soil movement has damaged roads {location} {time}. Emergency assistance is needed.",
            "A serious landslide has affected several structures {location} {time}. Residents are evacuating.",
            "A large amount of debris has blocked {location} {time}. People may be trapped nearby.",
            "A major landslide has damaged the road and nearby property {location} {time}."
        ],

        "Critical": [
            "A massive landslide has buried buildings {location} {time}. People are trapped under debris.",
            "A major landslide has destroyed the road and buried vehicles {location} {time}. Immediate rescue is required.",
            "Severe soil movement has buried multiple structures {location} {time}. Several people may be trapped.",
            "A catastrophic landslide has isolated an entire area {location} {time}. Rescue teams are urgently needed.",
            "A huge landslide has caused widespread destruction {location} {time}. People are trapped and require immediate rescue."
        ]
    },

    "Other": {
        "Low": [
            "A minor public safety issue was reported {location} {time}. No immediate danger is visible.",
            "A small obstruction is affecting the area {location} {time}. Assistance may be required.",
            "A minor emergency situation was reported {location} {time}. The situation is currently stable.",
            "A local safety concern was reported {location} {time}. No injuries are known.",
            "A minor incident is affecting {location} {time}. The area remains accessible."
        ],

        "Medium": [
            "A public safety problem was reported {location} {time}. Some assistance is required.",
            "An unexpected incident is affecting {location} {time}. People are requesting emergency support.",
            "A moderate safety issue has occurred {location} {time}. Authorities may be needed.",
            "An incident is disrupting normal activity {location} {time}. Assistance is requested.",
            "A local emergency situation is developing {location} {time}. Residents need support."
        ],

        "High": [
            "A serious public safety incident is affecting {location} {time}. Immediate assistance is needed.",
            "A major emergency has been reported {location} {time}. Several people may be affected.",
            "A dangerous situation is developing {location} {time}. Emergency responders are requested.",
            "A serious incident is threatening residents {location} {time}. Immediate response is required.",
            "A major safety problem is affecting {location} {time}. People are being moved to a safer area."
        ],

        "Critical": [
            "A life-threatening emergency is affecting {location} {time}. Immediate rescue and emergency response are required.",
            "A major incident has placed multiple people in immediate danger {location} {time}.",
            "A severe emergency is affecting the area {location} {time}. Several people require urgent assistance.",
            "A critical public safety situation is developing {location} {time}. Immediate emergency response is needed.",
            "A dangerous large-scale incident has occurred {location} {time}. People are trapped and require urgent help."
        ]
    }
}


# ---------------------------------------------------------
# GENERATE DATA
# ---------------------------------------------------------

rows = []


for emergency_type in EMERGENCY_TYPES:

    for priority in PRIORITIES:

        # Generate 25 examples for every
        # emergency type + priority combination
        generated = set()

        while len(generated) < 25:

            template = random.choice(
                templates[emergency_type][priority]
            )

            location = random.choice(locations)
            time = random.choice(times)

            description = template.format(
                location=location,
                time=time
            )

            generated.add(description)

        for description in generated:

            rows.append({
                "emergency_type": emergency_type,
                "description": description,
                "priority": priority
            })


# ---------------------------------------------------------
# SHUFFLE DATASET
# ---------------------------------------------------------

random.shuffle(rows)


# ---------------------------------------------------------
# CREATE DATAFRAME
# ---------------------------------------------------------

df = pd.DataFrame(rows)


# ---------------------------------------------------------
# SAVE DATASET
# ---------------------------------------------------------

output_path = Path(__file__).parent / "emergencies.csv"

df.to_csv(
    output_path,
    index=False
)


# ---------------------------------------------------------
# DISPLAY INFORMATION
# ---------------------------------------------------------

print("Dataset generated successfully!")
print()

print("Dataset shape:")
print(df.shape)
print()

print("Columns:")
print(df.columns.tolist())
print()

print("Priority distribution:")
print(df["priority"].value_counts())
print()

print("Emergency type distribution:")
print(df["emergency_type"].value_counts())
print()

print("Duplicate rows:")
print(df.duplicated().sum())
print()

print("Dataset saved to:")
print(output_path)