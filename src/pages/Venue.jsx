import React, { useEffect, useState, useRef } from "react";
import {
  FiMapPin,
  FiClock,
  FiChevronDown,
  FiExternalLink,
} from "react-icons/fi";
import BgAnimation from "../components/BgAnimation";
import Header2 from "../components/Header2";

// Venue map URLs constant
const VENUE_MAP_URLS = {
  "CREATIVE ZONE":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d489.0231190257444!2d75.933177!3d11.3211883!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba643ff0ccf681b%3A0xa1781f16be4c5d9!2sCreative%20Zone%2C%20NIT%20Calicut!5e0!3m2!1sen!2sin!4v1758233867198!5m2!1sen!2sin",
  "NEAR AUDITORIUM":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.0410174525939!2d75.9356279!3d11.3227158!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642fd394615b9%3A0x289531a014654cd2!2sAuditorium%20NITC!5e0!3m2!1sen!2sin!4v1758233997417!5m2!1sen!2sin",
  "AUDITORIUM":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.0410174525939!2d75.9356279!3d11.3227158!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642fd394615b9%3A0x289531a014654cd2!2sAuditorium%20NITC!5e0!3m2!1sen!2sin!4v1758233997417!5m2!1sen!2sin",
  "OAT": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.0428713147354!2d75.9332619!3d11.3221734!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e2eaf0e8a9%3A0xd74b8613855ce6cc!2sOpen%20Air%20Theatre%20(Gurudev%20Rabindranath%20Tagore%20Theatre)!5e0!3m2!1sen!2sin!4v1758234805684!5m2!1sen!2sin",
  "NEAR A HOSTEL X INFORMAL STAGE":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.0410174525939!2d75.9356279!3d11.3227158!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642fd394615b9%3A0x289531a014654cd2!2sAuditorium%20NITC!5e0!3m2!1sen!2sin!4v1758233997417!5m2!1sen!2sin",
  "ELHC": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.043133801406!2d75.933166!3d11.3220966!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e2c6790271%3A0xaec9701c7fc39bbb!2sELHC!5e0!3m2!1sen!2sin!4v1758236978842!5m2!1sen!2sin",
  "ELHC 101":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.043133801406!2d75.933166!3d11.3220966!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e2c6790271%3A0xaec9701c7fc39bbb!2sELHC!5e0!3m2!1sen!2sin!4v1758236978842!5m2!1sen!2sin",
  "ELHC 102":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.043133801406!2d75.933166!3d11.3220966!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e2c6790271%3A0xaec9701c7fc39bbb!2sELHC!5e0!3m2!1sen!2sin!4v1758236978842!5m2!1sen!2sin",
  "ELHC 103":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.043133801406!2d75.933166!3d11.3220966!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e2c6790271%3A0xaec9701c7fc39bbb!2sELHC!5e0!3m2!1sen!2sin!4v1758236978842!5m2!1sen!2sin",
  "ELHC 104":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.043133801406!2d75.933166!3d11.3220966!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e2c6790271%3A0xaec9701c7fc39bbb!2sELHC!5e0!3m2!1sen!2sin!4v1758236978842!5m2!1sen!2sin",
  "ELHC 201":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.043133801406!2d75.933166!3d11.3220966!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e2c6790271%3A0xaec9701c7fc39bbb!2sELHC!5e0!3m2!1sen!2sin!4v1758236978842!5m2!1sen!2sin",
  "ELHC 203":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.043133801406!2d75.933166!3d11.3220966!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e2c6790271%3A0xaec9701c7fc39bbb!2sELHC!5e0!3m2!1sen!2sin!4v1758236978842!5m2!1sen!2sin",
  "ELHC 301":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.043133801406!2d75.933166!3d11.3220966!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e2c6790271%3A0xaec9701c7fc39bbb!2sELHC!5e0!3m2!1sen!2sin!4v1758236978842!5m2!1sen!2sin",
  "ELHC 302":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.043133801406!2d75.933166!3d11.3220966!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e2c6790271%3A0xaec9701c7fc39bbb!2sELHC!5e0!3m2!1sen!2sin!4v1758236978842!5m2!1sen!2sin",
  "ELHC 401":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.043133801406!2d75.933166!3d11.3220966!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e2c6790271%3A0xaec9701c7fc39bbb!2sELHC!5e0!3m2!1sen!2sin!4v1758236978842!5m2!1sen!2sin",
  "NEW LECTURE HALL COMPLEX":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.043133801406!2d75.933166!3d11.3220966!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e296af53c1%3A0x6c80d64e328f7a7e!2sNew%20Lecture%20Hall%20Complex!5e0!3m2!1sen!2sin!4v1758235924089!5m2!1sen!2sin",
  "NLHC 103":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.043133801406!2d75.933166!3d11.3220966!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e296af53c1%3A0x6c80d64e328f7a7e!2sNew%20Lecture%20Hall%20Complex!5e0!3m2!1sen!2sin!4v1758235924089!5m2!1sen!2sin",
  "NLHC 104":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.043133801406!2d75.933166!3d11.3220966!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e296af53c1%3A0x6c80d64e328f7a7e!2sNew%20Lecture%20Hall%20Complex!5e0!3m2!1sen!2sin!4v1758235924089!5m2!1sen!2sin",
  "NLHC 201, 202, 203,204":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.043133801406!2d75.933166!3d11.3220966!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e296af53c1%3A0x6c80d64e328f7a7e!2sNew%20Lecture%20Hall%20Complex!5e0!3m2!1sen!2sin!4v1758235924089!5m2!1sen!2sin",
  "NLHC 204":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.043133801406!2d75.933166!3d11.3220966!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e296af53c1%3A0x6c80d64e328f7a7e!2sNew%20Lecture%20Hall%20Complex!5e0!3m2!1sen!2sin!4v1758235924089!5m2!1sen!2sin",
  "NLHC 301":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.043133801406!2d75.933166!3d11.3220966!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e296af53c1%3A0x6c80d64e328f7a7e!2sNew%20Lecture%20Hall%20Complex!5e0!3m2!1sen!2sin!4v1758235924089!5m2!1sen!2sin",
  "NLHC 302":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.043133801406!2d75.933166!3d11.3220966!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e296af53c1%3A0x6c80d64e328f7a7e!2sNew%20Lecture%20Hall%20Complex!5e0!3m2!1sen!2sin!4v1758235924089!5m2!1sen!2sin",
  "VLSI LAB":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3912.1628188290156!2d75.931471!3d11.3228073!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba643b57efc46ff%3A0x3b5170ce4a449144!2sVLSI%20Lab!5e0!3m2!1sen!2sin!4v1758236358199!5m2!1sen!2sin",
  "AMPHITHEATRE":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3912.1628188290156!2d75.9314603!3d11.3228073!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba6431e2a1dad89%3A0x57385fd5b3bb5bcb!2sGreen%20Amphitheatre!5e0!3m2!1sen!2sin!4v1758235692636!5m2!1sen!2sin",
  "GREEN AMPHITHEATRE":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3912.1628188290156!2d75.9314603!3d11.3228073!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba6431e2a1dad89%3A0x57385fd5b3bb5bcb!2sGreen%20Amphitheatre!5e0!3m2!1sen!2sin!4v1758235692636!5m2!1sen!2sin",
  "EE DEPARTMENT":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1956.0827171286787!2d75.9323093!3d11.322616!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e2cc8f0f29%3A0x9bfd2b06476e628a!2sDepartment%20of%20Electrical%20And%20Electronics%20Engineering%20%2C%20NITC!5e0!3m2!1sen!2sin!4v1758235979831!5m2!1sen!2sin",
  "EED SEMINAR HALL":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1956.0827171286787!2d75.9323093!3d11.322616!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e2cc8f0f29%3A0x9bfd2b06476e628a!2sDepartment%20of%20Electrical%20And%20Electronics%20Engineering%20%2C%20NITC!5e0!3m2!1sen!2sin!4v1758235979831!5m2!1sen!2sin",
  "ARYABHATTA HALL":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.0464513037288!2d75.9330896!3d11.3211259!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba643485e72f1a1%3A0xec2880df47736a18!2sAryabhata%20Hall!5e0!3m2!1sen!2sin!4v1758237073508!5m2!1sen!2sin",
  "MED SEMINAR HALL":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.0410174525939!2d75.9356279!3d11.3227158!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642fd394615b9%3A0x289531a014654cd2!2sAuditorium%20NITC!5e0!3m2!1sen!2sin!4v1758233997417!5m2!1sen!2sin",
  "CHANAKYA HALL":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.0471833242266!2d75.9334555!3d11.3209117!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642fd7b15c861%3A0x16b7658ed668e11e!2sChanakya%20Hall%2C%20National%20Institute%20Of%20Technology%20Calicut!5e0!3m2!1sen!2sin!4v1758236726398!5m2!1sen!2sin",
  "BASKETBALL COURT":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1956.0957069533295!2d75.9345056!3d11.3207156!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba6430023a8ccdf%3A0xd3e4f7c26947671!2sBasketball%20Court!5e0!3m2!1sen!2sin!4v1758236785241!5m2!1sen!2sin",
  "BHASKARA HALL":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.0464379754977!2d75.9330843!3d11.3211298!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba643d80e656353%3A0x88934a0e7f86301e!2sBhaskara%20Hall!5e0!3m2!1sen!2sin!4v1758235801877!5m2!1sen!2sin",
};

// Inline events data (replaces fetching from events.json or API)
const INLINE_EVENTS = [
  {
    "id": "yess-1",
    "title": "GAMING HUB",
    "description": "",
    "venue": "CREATIVE ZONE",
    "location": "CREATIVE ZONE",
    "startTime": "2025-09-20T09:00:00Z",
    "endTime": "2025-09-20T09:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-2",
    "title": "CARNIVAL (HOOP THROW, \nCUP PYRAMID, REFLEX ROD DROP, \nTYRE TOSS, CUP BOWLING, SANDBAG TOSS)",
    "description": "",
    "venue": "NEAR ABC",
    "location": "NEAR ABC",
    "startTime": "2025-09-20T09:00:00Z",
    "endTime": "2025-09-20T09:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-3",
    "title": "IEEE YESS 2025 INAUGURATION",
    "description": "",
    "venue": "OAT",
    "location": "OAT",
    "startTime": "2025-09-20T09:30:00Z",
    "endTime": "2025-09-20T10:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-4",
    "title": "MYOSA \nEXHIBITION (IEEE SENSORS COUNCIL)",
    "description": "",
    "venue": "ELHC 201",
    "location": "ELHC 201",
    "startTime": "2025-09-20T10:00:00Z",
    "endTime": "2025-09-20T10:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-5",
    "title": "MENTOR MATCH 2.0 - INDUSTRY CO SPONSORED MENTORSHIP (IEEE YP KERALA)",
    "description": "",
    "venue": "NLHC 201, 202, 203,204",
    "location": "NLHC 201, 202, 203,204",
    "startTime": "2025-09-20T10:00:00Z",
    "endTime": "2025-09-20T10:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-6",
    "title": "CADENCE WORKSHOP & COMPETITION (IEEE CASS KERALA CHAPTER)",
    "description": "",
    "venue": "VLSI LAB",
    "location": "VLSI LAB",
    "startTime": "2025-09-20T10:00:00Z",
    "endTime": "2025-09-20T10:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-7",
    "title": "ROBOXHIBIT 2025 (IEEE RAS KERALA CHAPTER)",
    "description": "",
    "venue": "NLHC GROUND FLOOR",
    "location": "NLHC GROUND FLOOR",
    "startTime": "2025-09-20T10:00:00Z",
    "endTime": "2025-09-20T10:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-8",
    "title": "WEB APPLICATION PENETRATION TESTING(CYBERNIX)",
    "description": "",
    "venue": "ELHC 102",
    "location": "ELHC 102",
    "startTime": "2025-09-20T10:00:00Z",
    "endTime": "2025-09-20T10:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-9",
    "title": "TECH DEBATE COMPETITION",
    "description": "",
    "venue": "AMPHITHEATRE",
    "location": "AMPHITHEATRE",
    "startTime": "2025-09-20T10:00:00Z",
    "endTime": "2025-09-20T10:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-10",
    "title": "ASTROGALLERY(IEEE \nAESS KERALA\nCHAPTER)",
    "description": "",
    "venue": "AUDITORIUM.4",
    "location": "AUDITORIUM.4",
    "startTime": "2025-09-20T10:00:00Z",
    "endTime": "2025-09-20T10:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-11",
    "title": "NANOVNA EXHIBITION\n(IEEE MTT-S \nKERALA CHAPTER AND IEEE SB GECBH)",
    "description": "",
    "venue": "AUDITORIUM.5",
    "location": "AUDITORIUM.5",
    "startTime": "2025-09-20T10:00:00Z",
    "endTime": "2025-09-20T10:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-12",
    "title": "HUMANITARIAN PROJECT EXPO 2025 (IEEE SIGHT KERALA)",
    "description": "",
    "venue": "AUDITORIUM.6",
    "location": "AUDITORIUM.6",
    "startTime": "2025-09-20T10:00:00Z",
    "endTime": "2025-09-20T10:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-13",
    "title": "LEVELUP - GAMIFIED LMS (UNYS)",
    "description": "",
    "venue": "AUDITORIUM.7",
    "location": "AUDITORIUM.7",
    "startTime": "2025-09-20T10:00:00Z",
    "endTime": "2025-09-20T10:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-14",
    "title": "HP GAMING LAP EXPO (IEEE CS\nKERALA CHAPTER)",
    "description": "",
    "venue": "AUDITORIUM.8",
    "location": "AUDITORIUM.8",
    "startTime": "2025-09-20T10:00:00Z",
    "endTime": "2025-09-20T10:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-15",
    "title": "DEBUG ME CHALLENGE (IEEE CS KERALA CHAPTER)",
    "description": "",
    "venue": "NLHC 104",
    "location": "NLHC 104",
    "startTime": "2025-09-20T10:00:00Z",
    "endTime": "2025-09-20T10:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-16",
    "title": "SAKUSEII: HANDS ON WORKSHOP ON PROJECT PROPOSAL (IEEE LMAG AND SSIT KERALA)",
    "description": "",
    "venue": "EED SEMINAR HALL",
    "location": "EED SEMINAR HALL",
    "startTime": "2025-09-20T10:00:00Z",
    "endTime": "2025-09-20T10:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-17",
    "title": "BOARD GAMES",
    "description": "",
    "venue": "NEAR AUDITORIUM",
    "location": "NEAR AUDITORIUM",
    "startTime": "2025-09-20T10:00:00Z",
    "endTime": "2025-09-20T10:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-18",
    "title": "WIE CHAIRS MEET (IEEE WIE KERALA)",
    "description": "",
    "venue": "ECED BLOCK 2 SEMINAR HALL",
    "location": "ECED BLOCK 2 SEMINAR HALL",
    "startTime": "2025-09-20T10:00:00Z",
    "endTime": "2025-09-20T10:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-19",
    "title": "AEROFLIGHT (IEEEAESS KERALA CHAPTER)",
    "description": "",
    "venue": "ELHC 402",
    "location": "ELHC 402",
    "startTime": "2025-09-20T10:00:00Z",
    "endTime": "2025-09-20T10:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-20",
    "title": "ESCAPE ROOM",
    "description": "",
    "venue": "MAIN BUILDING 109",
    "location": "MAIN BUILDING 109",
    "startTime": "2025-09-20T10:00:00Z",
    "endTime": "2025-09-20T10:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-21",
    "title": "AURORA(IEEE PHOTONICS\nKERALA CHAPTER)",
    "description": "",
    "venue": "AUDITORIUM.10",
    "location": "AUDITORIUM.10",
    "startTime": "2025-09-20T10:00:00Z",
    "endTime": "2025-09-20T10:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-22",
    "title": "AGRINEXT:AI,PRECISION &\nTHE FUTURE OF FARMING(KRISHI MITHRA)",
    "description": "",
    "venue": "ELHC 301.1",
    "location": "ELHC 301.1",
    "startTime": "2025-09-20T10:00:00Z",
    "endTime": "2025-09-20T10:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-23",
    "title": "TECHSPARK PROJECT DEMONSTRATION (IEEE COMSOC KERALA CHAPTER)",
    "description": "",
    "venue": "AUDITORIUM.11",
    "location": "AUDITORIUM.11",
    "startTime": "2025-09-20T10:00:00Z",
    "endTime": "2025-09-20T10:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-24",
    "title": "NEXTGEN INNOWARE",
    "description": "",
    "venue": "ELHC 301",
    "location": "ELHC 301",
    "startTime": "2025-09-20T10:30:00Z",
    "endTime": "2025-09-20T11:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-25",
    "title": "NEXA - SPS PROJECT EXPO (IEEE SPS KERALA PROJECT)",
    "description": "",
    "venue": "ELHC 403",
    "location": "ELHC 403",
    "startTime": "2025-09-20T10:30:00Z",
    "endTime": "2025-09-20T11:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-26",
    "title": "PROTOTYPE OR STILL MODELLING SHOWCASE",
    "description": "",
    "venue": "AUDITORIUM",
    "location": "AUDITORIUM",
    "startTime": "2025-09-20T10:30:00Z",
    "endTime": "2025-09-20T11:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-27",
    "title": "NITC TECHNICAL CLUB STALLS",
    "description": "",
    "venue": "AUDITORIUM.1",
    "location": "AUDITORIUM.1",
    "startTime": "2025-09-20T10:30:00Z",
    "endTime": "2025-09-20T11:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-28",
    "title": "COMPANY EXHIBITION",
    "description": "",
    "venue": "AUDITORIUM.2",
    "location": "AUDITORIUM.2",
    "startTime": "2025-09-20T10:30:00Z",
    "endTime": "2025-09-20T11:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-29",
    "title": "DRONE EXHIBITION (IEEE CSS KERALA CHAPTER)",
    "description": "",
    "venue": "AUDITORIUM.3",
    "location": "AUDITORIUM.3",
    "startTime": "2025-09-20T10:30:00Z",
    "endTime": "2025-09-20T11:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-30",
    "title": "RISAIKURU (IEEE PIE KERALA SECTION)",
    "description": "",
    "venue": "AUDITORIUM.9",
    "location": "AUDITORIUM.9",
    "startTime": "2025-09-20T10:30:00Z",
    "endTime": "2025-09-20T11:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-31",
    "title": "CHAMPIONS OF THE DEEP (IEEE OCEANIC SOCIETY KERALA CHAPTER)",
    "description": "",
    "venue": "NEAR A HOSTEL X INFORMAL STAGE",
    "location": "NEAR A HOSTEL X INFORMAL STAGE",
    "startTime": "2025-09-20T10:30:00Z",
    "endTime": "2025-09-20T11:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-32",
    "title": "TURING COMPETITION",
    "description": "",
    "venue": "ELHC 203",
    "location": "ELHC 203",
    "startTime": "2025-09-20T10:30:00Z",
    "endTime": "2025-09-20T11:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-33",
    "title": "TECHCORE: WORKSHOP ON AGENTIC AI (IEEE EDSOC KERALA CHAPTER)",
    "description": "",
    "venue": "NLHC 103",
    "location": "NLHC 103",
    "startTime": "2025-09-20T10:30:00Z",
    "endTime": "2025-09-20T11:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-34",
    "title": "PRO2 (IEEE SB CE KARUNAGAPALLY)",
    "description": "",
    "venue": "NLHC 101",
    "location": "NLHC 101",
    "startTime": "2025-09-20T10:30:00Z",
    "endTime": "2025-09-20T11:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-35",
    "title": "MINDMESH: \nBRAIN-COMPUTER\nINTERFACE (BCI) \nPLAYGROUND (IEEE SB RSET)",
    "description": "",
    "venue": "ELHC 104",
    "location": "ELHC 104",
    "startTime": "2025-09-20T10:30:00Z",
    "endTime": "2025-09-20T11:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-36",
    "title": "TECHXHIBIT: IEEE MACE SB IN ACTION AND SHOW YOUR INNOVATION (EXHIBIT) (IEEE VTS KERALA CHAPTER)",
    "description": "",
    "venue": "ELHC 202",
    "location": "ELHC 202",
    "startTime": "2025-09-20T10:30:00Z",
    "endTime": "2025-09-20T11:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-37",
    "title": "RISE OF AGENTIC\n MACHINES:\n HANDS-ON \nWORKSHOP ON\n AI AUTOMATION (IEEE SB ADOOR)",
    "description": "",
    "venue": "ELHC 103",
    "location": "ELHC 103",
    "startTime": "2025-09-20T10:30:00Z",
    "endTime": "2025-09-20T11:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-38",
    "title": "CIRCUIT BOULEVARD: A CIRCUIT ARCADE (IEEE SSCS KERALA CHAPTER)",
    "description": "",
    "venue": "NEAR AUDITORIUM.2",
    "location": "NEAR AUDITORIUM.2",
    "startTime": "2025-09-20T10:30:00Z",
    "endTime": "2025-09-20T11:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-39",
    "title": "VIBE CODING SESSION",
    "description": "",
    "venue": "NLHC 301",
    "location": "NLHC 301",
    "startTime": "2025-09-20T10:30:00Z",
    "endTime": "2025-09-20T11:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-40",
    "title": "UI/UX WORKSHOP (FOF KOZHIKODE)",
    "description": "",
    "venue": "ELHC 302",
    "location": "ELHC 302",
    "startTime": "2025-09-20T10:30:00Z",
    "endTime": "2025-09-20T11:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-41",
    "title": "TAG RACE (IEEE SB GEC KANNUR)",
    "description": "",
    "venue": "DB 311",
    "location": "DB 311",
    "startTime": "2025-09-20T10:30:00Z",
    "endTime": "2025-09-20T11:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-42",
    "title": "TECHCORE: INTRODUCTION TO CFD (IEEE EDSOC KERALA CHAPTER)",
    "description": "",
    "venue": "NLHC 302",
    "location": "NLHC 302",
    "startTime": "2025-09-20T10:30:00Z",
    "endTime": "2025-09-20T11:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-43",
    "title": "IEEE TEMS & PROCOMM JT. CHAPTER KERALA SECTION INAUGURATION",
    "description": "",
    "venue": "ARYABHATTA HALL",
    "location": "ARYABHATTA HALL",
    "startTime": "2025-09-20T11:00:00Z",
    "endTime": "2025-09-20T11:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-44",
    "title": "QUICK START TO RFID TECHNOLOGY (SLOT 1) (CRFID KERALA SECTION)",
    "description": "",
    "venue": "MED SEMINAR HALL",
    "location": "MED SEMINAR HALL",
    "startTime": "2025-09-20T11:00:00Z",
    "endTime": "2025-09-20T11:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-45",
    "title": "SOCIETY INAUGURATION - SENSOR COUNCIL, AESS, IES, SIGHT (IEEE SB NITC)",
    "description": "",
    "venue": "CHANAKYA HALL",
    "location": "CHANAKYA HALL",
    "startTime": "2025-09-20T11:00:00Z",
    "endTime": "2025-09-20T11:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-46",
    "title": "PATRONUS: SELF DEFENSE WORKSHOP (IEEE WIE KERALA)",
    "description": "",
    "venue": "KHOKHO COURT",
    "location": "KHOKHO COURT",
    "startTime": "2025-09-20T11:30:00Z",
    "endTime": "2025-09-20T12:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-47",
    "title": "MIC CHECK",
    "description": "",
    "venue": "OAT",
    "location": "OAT",
    "startTime": "2025-09-20T12:00:00Z",
    "endTime": "2025-09-20T12:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-48",
    "title": "INNOVATION PITCH CORNER (IEEE IA/IE/PELS JT. CHAPTER KERALA SECTION)",
    "description": "",
    "venue": "ELHC 101",
    "location": "ELHC 101",
    "startTime": "2025-09-20T01:30:00Z",
    "endTime": "2025-09-20T02:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-49",
    "title": "DATA ANALYTICS & BUSINESS INTELLIGENCE\n(TRANSEDUVERSE)",
    "description": "",
    "venue": "ELHC 102",
    "location": "ELHC 102",
    "startTime": "2025-09-20T01:30:00Z",
    "endTime": "2025-09-20T02:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-50",
    "title": "TECHCORE: INTRODUCTION TO EMBEDDED SYSTEM USING ESP 32 (IEEE EDSOC KERALA CHAPTER)",
    "description": "",
    "venue": "NLHC 103",
    "location": "NLHC 103",
    "startTime": "2025-09-20T01:30:00Z",
    "endTime": "2025-09-20T02:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-51",
    "title": "CIRCUIT CLASH (IEEE SB TOCH)",
    "description": "",
    "venue": "ELHC 104",
    "location": "ELHC 104",
    "startTime": "2025-09-20T01:30:00Z",
    "endTime": "2025-09-20T02:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-52",
    "title": "FLIGHT-101(NUKE LABS)",
    "description": "",
    "venue": "ELHC 301.1",
    "location": "ELHC 301.1",
    "startTime": "2025-09-20T01:30:00Z",
    "endTime": "2025-09-20T02:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-53",
    "title": "CEO'S PANEL DISCUSSION",
    "description": "",
    "venue": "ARYABHATTA HALL",
    "location": "ARYABHATTA HALL",
    "startTime": "2025-09-20T02:00:00Z",
    "endTime": "2025-09-20T02:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-54",
    "title": "MYOSA \nEXHIBITION (IEEE SENSORS COUNCIL)",
    "description": "",
    "venue": "ELHC 201",
    "location": "ELHC 201",
    "startTime": "2025-09-20T02:00:00Z",
    "endTime": "2025-09-20T02:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-55",
    "title": "QUICK START TO RFID TECHNOLOGY (SLOT 2) (CRFID KERALA SECTION)",
    "description": "",
    "venue": "MED SEMINAR HALL",
    "location": "MED SEMINAR HALL",
    "startTime": "2025-09-20T02:00:00Z",
    "endTime": "2025-09-20T02:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-56",
    "title": "MENTOR MATCH 2.0 - INDUSTRY CO SPONSORED MENTORSHIP (IEEE YP KERALA)",
    "description": "",
    "venue": "NLHC 201, 202, 203,204",
    "location": "NLHC 201, 202, 203,204",
    "startTime": "2025-09-20T02:00:00Z",
    "endTime": "2025-09-20T02:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-57",
    "title": "CADENCE WORKSHOP & COMPETITION (IEEE CASS KERALA CHAPTER)",
    "description": "",
    "venue": "VLSI LAB",
    "location": "VLSI LAB",
    "startTime": "2025-09-20T02:00:00Z",
    "endTime": "2025-09-20T02:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-58",
    "title": "3D PRINTING WORKSHOP",
    "description": "",
    "venue": "ELHC 301",
    "location": "ELHC 301",
    "startTime": "2025-09-20T02:00:00Z",
    "endTime": "2025-09-20T02:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-59",
    "title": "YESSPLORA: AR TREASURE HUNT (IEEE PES KERALA CHAPTER AND IEEE SB GEC KOZHIKODE)",
    "description": "",
    "venue": "AMPHITHEATRE",
    "location": "AMPHITHEATRE",
    "startTime": "2025-09-20T02:00:00Z",
    "endTime": "2025-09-20T02:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-60",
    "title": "WAVELINK (IEEE \nSB CUSAT &\nIEEE MTTS KS)",
    "description": "",
    "venue": "EED SEMINAR HALL",
    "location": "EED SEMINAR HALL",
    "startTime": "2025-09-20T02:00:00Z",
    "endTime": "2025-09-20T02:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-61",
    "title": "INTEGRATION BEE",
    "description": "",
    "venue": "ELHC 203",
    "location": "ELHC 203",
    "startTime": "2025-09-20T02:00:00Z",
    "endTime": "2025-09-20T02:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-62",
    "title": "ENTREPRENEURSHIP\nWORKSHOP",
    "description": "",
    "venue": "ECED BLOCK 2 SEMINAR HALL",
    "location": "ECED BLOCK 2 SEMINAR HALL",
    "startTime": "2025-09-20T02:00:00Z",
    "endTime": "2025-09-20T02:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-63",
    "title": "HACK A WEBSITE LIKE A PRO (IEEE KERALA SECTION WEB COORDINATION TEAM)",
    "description": "",
    "venue": "NLHC 301",
    "location": "NLHC 301",
    "startTime": "2025-09-20T02:00:00Z",
    "endTime": "2025-09-20T02:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-64",
    "title": "AERO-RELIEF(IEEE\nCSS KERALA \nCHAPTER)",
    "description": "",
    "venue": "NLHC 302",
    "location": "NLHC 302",
    "startTime": "2025-09-20T02:00:00Z",
    "endTime": "2025-09-20T02:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-65",
    "title": "MENTALISM (IEEE WIE KERALA)",
    "description": "",
    "venue": "BHASKARA HALL",
    "location": "BHASKARA HALL",
    "startTime": "2025-09-20T02:30:00Z",
    "endTime": "2025-09-20T03:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-66",
    "title": "SPIN FIESTA (IEEE CS KERALA CHAPTER)",
    "description": "",
    "venue": "NLHC 104",
    "location": "NLHC 104",
    "startTime": "2025-09-20T02:30:00Z",
    "endTime": "2025-09-20T03:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-67",
    "title": "ETCH YOUR PCB: PCB ETCHING AND DESIGNING WORKSHOP (IEEE SB GECT)",
    "description": "",
    "venue": "ELHC 103",
    "location": "ELHC 103",
    "startTime": "2025-09-20T02:30:00Z",
    "endTime": "2025-09-20T03:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-68",
    "title": "SECRET SQUAD OF SOLVERS (IEEE PUZZLERS)",
    "description": "",
    "venue": "NEAR AUDITORIUM.1",
    "location": "NEAR AUDITORIUM.1",
    "startTime": "2025-09-20T02:30:00Z",
    "endTime": "2025-09-20T03:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-69",
    "title": "TAG RACE (IEEE SB GEC KANNUR)",
    "description": "",
    "venue": "DB 311",
    "location": "DB 311",
    "startTime": "2025-09-20T02:30:00Z",
    "endTime": "2025-09-20T03:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-70",
    "title": "YOUTUBER CONCLAVE(SENTHIL)",
    "description": "",
    "venue": "OAT",
    "location": "OAT",
    "startTime": "2025-09-20T03:00:00Z",
    "endTime": "2025-09-20T03:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-71",
    "title": "ENERGY CONSERVATION IN DESIGN",
    "description": "",
    "venue": "ELHC 302",
    "location": "ELHC 302",
    "startTime": "2025-09-20T03:00:00Z",
    "endTime": "2025-09-20T03:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-72",
    "title": "GAME NIGHT(ADIZYA EVENT)",
    "description": "",
    "venue": "AMPHITHEATRE",
    "location": "AMPHITHEATRE",
    "startTime": "2025-09-20T04:00:00Z",
    "endTime": "2025-09-20T04:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-73",
    "title": "VALEDICTORY",
    "description": "",
    "venue": "ARYABHATTA HALL",
    "location": "ARYABHATTA HALL",
    "startTime": "2025-09-20T04:30:00Z",
    "endTime": "2025-09-20T05:00:00Z",
    "speaker": ""
  },
  {
    "id": "yess-74",
    "title": "FPV DRONE SHOW (IEEE CSS KERALA CHAPTER)",
    "description": "",
    "venue": "FOOTBALL GROUND",
    "location": "FOOTBALL GROUND",
    "startTime": "2025-09-20T05:00:00Z",
    "endTime": "2025-09-20T05:30:00Z",
    "speaker": ""
  },
  {
    "id": "yess-75",
    "title": "PRO SHOW: ANJU JOSEPH",
    "description": "",
    "venue": "OAT",
    "location": "OAT",
    "startTime": "2025-09-20T06:30:00Z",
    "endTime": "2025-09-20T07:00:00Z",
    "speaker": ""
  }
]

function Venue() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState("");
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [mode, setMode] = useState("venue"); // 'venue' or 'event'
  const [eventQuery, setEventQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100) setIsScrolled(true);
      else setIsScrolled(true);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Use inline events instead of fetching from file/API
    const fetchEvents = async () => {
      setLoading(true);
      setError("");
      try {
        const data = Array.isArray(INLINE_EVENTS) ? INLINE_EVENTS : [];
        setEvents(data);

        const venueSet = new Map();
        data.forEach((ev) => {
          const name = ev.venue || ev.location || ""; // don't add Unknown Venue placeholder
          if (!name || name.trim().length === 0) return;
          if (!venueSet.has(name)) {
            venueSet.set(name, {
              name,
              lat: ev.latitude || ev.lat || null,
              lng: ev.longitude || ev.lng || null,
              address: ev.location || ev.venue || "",
              mapUrl: ev.mapUrl || "",
            });
          }
        });

        const fixedVenueNamesRaw = [
          "OAT",
          "ARYABHATTA HALL",
          "BHASKARA HALL",
          "ELHC 201",
          "ELHC 101",
          "MED SEMINAR HALL",
          "NLHC 201, 202, 203,204",
          "VLSI LAB",
          "CHANAKYA HALL",
          "ELHC 301",
          "ELHC 402",
          "ELHC 403",
          "ELHC 401",
          "AMPHITHEATRE",
          "FOOTBALL GROUND",
          "AUDITORIUM",
          "NLHC 104",
          "EED SEMINAR HALL",
          "NEAR A HOSTEL X INFORMAL STAGE",
          "ELHC 203",
          "NLHC 103",
          "CADCAM LAB",
          "NLHC 204",
          "ELHC 104",
          "ELHC 202",
          "ELHC 103",
          "KHOKHO COURT",
          "CREATIVE ZONE",
          "NEAR AUDITORIUM",
          "ECED BLOCK 2 SEMINAR HALL",
          "ELHC 102",
          "NLHC 301",
          "MAIN BUILDING 109",
          "ELHC 302",
          "BASKETBALL COURT",
          "NLHC 302",
        ];

        const fixedVenueNames = Array.from(
          new Set(
            fixedVenueNamesRaw.map((s) => (s || "").trim()).filter(Boolean)
          )
        );

        const fixedSet = new Set(fixedVenueNames);

        const fixedVenues = fixedVenueNames.map((name) =>
          venueSet.has(name)
            ? venueSet.get(name)
            : { name, address: "", lat: null, lng: null }
        );

        const remaining = Array.from(venueSet.values()).filter(
          (v) => !fixedSet.has(v.name)
        );
        const venueArray = [...fixedVenues, ...remaining];
        setVenues(venueArray);
        if (venueArray.length > 0) setSelectedVenue(venueArray[0].name);
      } catch (err) {
        setError("Failed to process inline events.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const eventsForSelectedVenue = events.filter((ev) => {
    const name = ev.venue || ev.location || "";
    if (!name || name.trim().length === 0) return false;
    return name === selectedVenue;
  });

  // Sort events by startTime ascending for schedule display
  eventsForSelectedVenue.sort((a, b) => {
    const ta = a.startTime ? new Date(a.startTime).getTime() : Infinity;
    const tb = b.startTime ? new Date(b.startTime).getTime() : Infinity;
    return ta - tb;
  });

  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    try {
      const d = new Date(dateTimeString);
      return d.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return dateTimeString;
    }
  };

  const getEventStart = (ev) => {
    return (
      ev.startTime ||
      ev.start ||
      ev.start_time ||
      ev.startsAt ||
      ev.startDate ||
      ev.start_date ||
      ev.dateTime ||
      ev.datetime ||
      ev.date ||
      (ev.schedule && ev.schedule.start)
    );
  };

  const getEventEnd = (ev) => {
    return (
      ev.endTime ||
      ev.end ||
      ev.end_time ||
      ev.endsAt ||
      ev.endDate ||
      ev.end_date ||
      (ev.schedule && ev.schedule.end)
    );
  };

  const eventTimeRange = (ev) => {
    const s = getEventStart(ev);
    const e = getEventEnd(ev);
    if (!s && !e) return "TBA";
    if (s && !e) return formatTime(s);
    try {
      return `${formatTime(s)} - ${formatTime(e)}`;
    } catch {
      return formatTime(s) || "TBA";
    }
  };

  const venueMeta = venues.find((v) => v.name === selectedVenue);
  const hasLocation = Boolean(
    (venueMeta && venueMeta.lat && venueMeta.lng) ||
      (venueMeta && venueMeta.address && venueMeta.address.trim().length > 0)
  );
  const mapSrc = (() => {
    const selectedEvent = events.find(
      (ev) => (ev.id || ev._id) === selectedEventId
    );
    // If we have a selected event, use its venue to lookup the map URL
    if (selectedEvent) {
      const eventVenue = selectedEvent.venue || selectedEvent.location || "";
      if (eventVenue && VENUE_MAP_URLS[eventVenue]) {
        return VENUE_MAP_URLS[eventVenue];
      }
    }
    // If no event selected or no map for event's venue, use selected venue
    if (selectedVenue && VENUE_MAP_URLS[selectedVenue]) {
      return VENUE_MAP_URLS[selectedVenue];
    }
    return "";
  })();

  // On mobile, when selection changes (venue or event), scroll map into view
  useEffect(() => {
    try {
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      if (!isMobile) return;
      if (!mapRef.current) return;
      // Smooth scroll to the map container
      mapRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) {
      // ignore errors
    }
  }, [selectedVenue, selectedEventId]);

  const listToRender =
    mode === "event" && eventQuery.trim().length > 0
      ? events.filter((ev) => {
          const q = eventQuery.trim().toLowerCase();
          const inTitle = (ev.title || "").toLowerCase().includes(q);
          const inSpeaker = (ev.speaker || "").toLowerCase().includes(q);
          const inVenue = (ev.venue || ev.location || "")
            .toLowerCase()
            .includes(q);
          return inTitle || inSpeaker || inVenue;
        })
      : events;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-x-hidden">
      <div className="fixed inset-0 z-0">
        <BgAnimation />
      </div>
      <div className="relative z-10 w-full">
        <Header2 isScrolled={isScrolled} />

        <div className="md:mt-20 mt-15 min-h-screen bg-black/20 backdrop-blur-sm p-6 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-red-500/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-red-500/70">
          <div className="max-w-6xl mx-auto">
            <div className="text-center py-8" data-aos="fade-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-white flex items-center justify-center gap-3">
                <FiMapPin className="text-3xl text-[#fe4a56]" />
                Venues & Schedules
              </h2>
              <p className="text-white/80 mt-2 max-w-2xl mx-auto">
                Select a venue to view all scheduled events and the location on
                map.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-1">
                <div className="bg-black/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-4">
                  <div className="mt-2 text-sm text-gray-300">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Search options</div>
                      <div className="text-xs text-gray-400">Choose mode</div>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => setMode("venue")}
                        className={`px-3 py-1 rounded-lg text-sm font-medium border ${
                          mode === "venue"
                            ? "bg-[#fe4a56] text-white border-[#fe4a56]"
                            : "text-gray-300 border-gray-700/40"
                        }`}
                      >
                        Search by Venue
                      </button>
                      <button
                        onClick={() => setMode("event")}
                        className={`px-3 py-1 rounded-lg text-sm font-medium border ${
                          mode === "event"
                            ? "bg-[#fe4a56] text-white border-[#fe4a56]"
                            : "text-gray-300 border-gray-700/40"
                        }`}
                      >
                        Search by Event
                      </button>
                    </div>

                    {mode === "venue" ? (
                      <>
                        <label className="block text-sm font-medium text-gray-300 mt-4 mb-2">
                          Choose Venue
                        </label>
                        <div className="relative">
                          <select
                            className="w-full appearance-none bg-transparent border border-gray-700/40 px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#fe4a56]"
                            value={selectedVenue}
                            onChange={(e) => setSelectedVenue(e.target.value)}
                          >
                            {venues.map((v) => (
                              <option
                                key={v.name}
                                value={v.name}
                                className="text-black"
                              >
                                {v.name}
                              </option>
                            ))}
                          </select>
                          <FiChevronDown className="absolute right-3 top-3 text-gray-300 pointer-events-none" />
                        </div>
                        <div className="mt-3 text-xs text-gray-400">
                          <div className="font-medium">
                            Events at this venue
                          </div>
                          <div className="text-xs text-gray-400">
                            {eventsForSelectedVenue.length} event(s)
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="mt-3 text-xs text-gray-400">
                        <div className="font-medium">Search events</div>
                        <div className="text-xs mt-1 relative">
                          <input
                            value={eventQuery}
                            onChange={(e) => setEventQuery(e.target.value)}
                            placeholder="Search by event title, speaker or venue"
                            className="w-full bg-transparent border border-gray-700/40 px-3 py-2 rounded-lg text-white focus:outline-none pr-10"
                          />
                          {eventQuery && (
                            <button
                              onClick={() => {
                                setEventQuery("");
                                setSelectedEventId(null);
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                              aria-label="Clear search"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        {/* No-results message when search active but no matches */}
                        {mode === "event" &&
                          eventQuery.trim() &&
                          listToRender.length === 0 && (
                            <div className="mt-2 text-xs text-gray-400">
                              No events match your search.
                              <button
                                onClick={() => {
                                  setEventQuery("");
                                  setSelectedEventId(null);
                                }}
                                className="ml-2 text-sm text-[#fe4a56] underline"
                              >
                                Clear
                              </button>
                            </div>
                          )}
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="text-sm text-gray-300 font-medium mb-2">
                      All events
                    </div>
                    <div className="space-y-2 max-h-64 overflow-auto pr-2">
                      {loading ? (
                        <div className="flex items-center gap-2 text-gray-300">
                          <div className="h-6 w-6 rounded-full border-2 border-[#fe4a56] border-t-transparent animate-spin"></div>
                          Loading events...
                        </div>
                      ) : error ? (
                        <div className="text-red-400">{error}</div>
                      ) : events.length === 0 ? (
                        <div className="text-gray-400">
                          No events available.
                        </div>
                      ) : (
                        listToRender.map((ev) => {
                          const evId = ev.id || ev._id;
                          const evVenue = ev.venue || ev.location || "";
                          const isSelected = selectedEventId === evId;
                          return (
                            <button
                              key={evId}
                              onClick={() => {
                                const nextSelected = isSelected ? null : evId;
                                setSelectedEventId(nextSelected);
                                if (nextSelected) {
                                  setMode("event");
                                  if (evVenue && evVenue.trim().length > 0)
                                    setSelectedVenue(evVenue);
                                }
                              }}
                              className={`w-full text-left flex items-start gap-3 bg-black/30 p-3 rounded-lg border ${
                                isSelected
                                  ? "border-[#fe4a56]"
                                  : "border-gray-700/40"
                              }`}
                            >
                              <div className="flex-shrink-0">
                                <FiClock className="text-[#fe4a56] mt-1" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between gap-3">
                                  <h4 className="text-sm font-semibold text-white line-clamp-2">
                                    {ev.title}
                                  </h4>
                                  <span className="text-xs text-gray-400">
                                    {eventTimeRange(ev)}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-300 line-clamp-2 mt-1">
                                  {ev.description}
                                </p>
                                {evVenue && (
                                  <div className="text-xs text-gray-400 mt-1">
                                    {evVenue}
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="bg-black/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-4 h-full flex flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {selectedVenue || "Select a venue"}
                      </h3>
                      <p className="text-sm text-gray-400">Location & map</p>
                    </div>
                    <div className="text-right">
                      {selectedEventId ? (
                        (() => {
                          const ev = events.find(
                            (e) => (e.id || e._id) === selectedEventId
                          );
                          if (!ev) return null;
                          return (
                            <div className="text-sm">
                              <div className="text-xs text-gray-400">
                                Selected event
                              </div>
                              <div className="font-semibold text-white">
                                {ev.title}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {eventTimeRange(ev)}
                              </div>
                              {ev.location && (
                                <div className="text-xs text-gray-400 mt-1">
                                  {ev.location}
                                </div>
                              )}
                            </div>
                          );
                        })()
                      ) : (
                        <div className="text-sm text-gray-400">
                          No event selected
                        </div>
                      )}
                    </div>
                  </div>

                  {hasLocation || selectedEventId ? (
                    <div
                      ref={mapRef}
                      className="mt-4 flex-1 min-h-[420px] rounded-lg overflow-hidden border border-gray-700/30 flex flex-col"
                    >
                      <iframe
                        title="venue-map"
                        src={mapSrc}
                        className="w-full flex-1 h-full"
                        loading="lazy"
                        style={{ border: 0 }}
                      />
                    </div>
                  ) : (
                    <div className="mt-4 flex-1 min-h-[160px] rounded-lg flex items-center justify-center border border-dashed border-gray-700/20 text-gray-500">
                      Location not provided for this venue
                    </div>
                  )}

                  <div className="mt-4">
                    <p className="text-sm text-gray-300">
                      Upcoming events at{" "}
                      <span className="font-semibold">{selectedVenue}</span>
                    </p>
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                      {eventsForSelectedVenue.slice(0, 6).map((ev) => (
                        <div
                          key={ev.id || ev._id}
                          className="bg-black/30 p-3 rounded-lg border border-gray-700/40"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-white">
                                {ev.title}
                              </p>
                              <p className="text-xs text-gray-400">
                                {eventTimeRange(ev)}
                              </p>
                            </div>
                            <div className="text-xs text-gray-400">
                              {ev.speaker || ""}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Venue;
