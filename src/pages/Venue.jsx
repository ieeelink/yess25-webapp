import React, { useEffect, useState, useRef } from "react";
import { FiMapPin, FiChevronDown, FiExternalLink } from "react-icons/fi";
import BgAnimation from "../components/BgAnimation";
import Header2 from "../components/Header2";

// Venue map URLs constant
const VENUE_MAP_URLS = {
  "CREATIVE ZONE":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d489.0231190257444!2d75.933177!3d11.3211883!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba643ff0ccf681b%3A0xa1781f16be4c5d9!2sCreative%20Zone%2C%20NIT%20Calicut!5e0!3m2!1sen!2sin!4v1758233867198!5m2!1sen!2sin",
  "NEAR AUDITORIUM":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.0410174525939!2d75.9356279!3d11.3227158!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642fd394615b9%3A0x289531a014654cd2!2sAuditorium%20NITC!5e0!3m2!1sen!2sin!4v1758233997417!5m2!1sen!2sin",
  AUDITORIUM:
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.0410174525939!2d75.9356279!3d11.3227158!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642fd394615b9%3A0x289531a014654cd2!2sAuditorium%20NITC!5e0!3m2!1sen!2sin!4v1758233997417!5m2!1sen!2sin",
  "OAT": "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.0428713147354!2d75.9332619!3d11.3221734!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e2eaf0e8a9%3A0xd74b8613855ce6cc!2sOpen%20Air%20Theatre%20(Gurudev%20Rabindranath%20Tagore%20Theatre)!5e0!3m2!1sen!2sin!4v1758234805684!5m2!1sen!2sin",
  "NEAR ABC":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.0410174525939!2d75.9356279!3d11.3227158!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642fd394615b9%3A0x289531a014654cd2!2sAuditorium%20NITC!5e0!3m2!1sen!2sin!4v1758233997417!5m2!1sen!2sin",
  "NEAR A HOSTEL X INFORMAL STAGE":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1915.3430806284005!2d75.9337673!3d11.3208101!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba643001f910b25%3A0x55754bd833adf99a!2sHostel%20A!5e1!3m2!1sen!2sin!4v1758318291356!5m2!1sen!2sin",
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
  "ELHC 402":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.043133801406!2d75.933166!3d11.3220966!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e2c6790271%3A0xaec9701c7fc39bbb!2sELHC!5e0!3m2!1sen!2sin!4v1758236978842!5m2!1sen!2sin",
  "ELHC 403":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.043133801406!2d75.933166!3d11.3220966!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e2c6790271%3A0xaec9701c7fc39bbb!2sELHC!5e0!3m2!1sen!2sin!4v1758236978842!5m2!1sen!2sin",
  "ELHC 202":
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
  "NLHC GROUND FLOOR":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.043133801406!2d75.933166!3d11.3220966!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e296af53c1%3A0x6c80d64e328f7a7e!2sNew%20Lecture%20Hall%20Complex!5e0!3m2!1sen!2sin!4v1758235924089!5m2!1sen!2sin",
  "NLHC 101":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.043133801406!2d75.933166!3d11.3220966!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e296af53c1%3A0x6c80d64e328f7a7e!2sNew%20Lecture%20Hall%20Complex!5e0!3m2!1sen!2sin!4v1758235924089!5m2!1sen!2sin",
  "VLSI LAB":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3912.1628188290156!2d75.931471!3d11.3228073!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba643b57efc46ff%3A0x3b5170ce4a449144!2sVLSI%20Lab!5e0!3m2!1sen!2sin!4v1758236358199!5m2!1sen!2sin",
  AMPHITHEATRE:
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3912.1628188290156!2d75.9314603!3d11.3228073!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba6431e2a1dad89%3A0x57385fd5b3bb5bcb!2sGreen%20Amphitheatre!5e0!3m2!1sen!2sin!4v1758235692636!5m2!1sen!2sin",
  "GREEN AMPHITHEATRE":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3912.1628188290156!2d75.9314603!3d11.3228073!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba6431e2a1dad89%3A0x57385fd5b3bb5bcb!2sGreen%20Amphitheatre!5e0!3m2!1sen!2sin!4v1758235692636!5m2!1sen!2sin",
  "EE DEPARTMENT":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1956.0827171286787!2d75.9323093!3d11.322616!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e2cc8f0f29%3A0x9bfd2b06476e628a!2sDepartment%20of%20Electrical%20And%20Electronics%20Engineering%20%2C%20NITC!5e0!3m2!1sen!2sin!4v1758235979831!5m2!1sen!2sin",
  "EED SEMINAR HALL":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15648.635645311615!2d75.935195!3d11.3230931!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e2c5a485bd%3A0xaa368eb7e95d5d1!2sElectrical%20Engineering%20PG%20Block!5e0!3m2!1sen!2sin!4v1758318238473!5m2!1sen!2sin",
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
  "FOOTBALL GROUND":
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3912.188678618005!2d75.9316307!3d11.3209157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e27e58137d%3A0x2195a98e8f3047ae!2sNITC%20Football%20Ground!5e0!3m2!1sen!2sin!4v1758318179236!5m2!1sen!2sin",
  "ECED BLOCK 2 SEMINAR HALL":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1956.0827171286787!2d75.9323093!3d11.322616!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e2cc8f0f29%3A0x9bfd2b06476e628a!2sDepartment%20of%20Electronics%20and%20Communication%20Engineering%2C%20NITC!5e0!3m2!1sen!2sin!4v1758235979831!5m2!1sen!2sin",
  "MAIN BUILDING 109":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.0453744364057!2d75.9337765!3d11.321441!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642e2b02a3bf5%3A0x29f91d9e4369a45d!2sMain%20Building%2C%20Kattangal%2C%20Kerala%20673601!5e0!3m2!1sen!2sin!4v1758318700886!5m2!1sen!2sin",
  "DB 311":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.043133801406!2d75.933166!3d11.3220966!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642fd394615b9%3A0x289531a014654cd2!2sDB%20Block%2C%20NIT%20Calicut!5e0!3m2!1sen!2sin!4v1758235924089!5m2!1sen!2sin",
  "CADCAM LAB":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d978.0439423748862!2d75.93544966537453!3d11.321860019257326!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba642fd7d2cddaf%3A0x99f0e36e2a913519!2sRobotics%20Interest%20Group!5e0!3m2!1sen!2sin!4v1758318463298!5m2!1sen!2sin",
  "KHOKHO COURT":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3912.189147488964!2d75.9323112!3d11.3208814!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba6431d5ae155db%3A0xb95615edcc6ecc20!2sKho%20Kho%20Court!5e0!3m2!1sen!2sin!4v1758318565892!5m2!1sen!2sin",
  "MED SEMINAR HALL":
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3912.187754541689!2d75.9328491!3d11.3209833!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba643005241f8dd%3A0x9a48ac9124dac16d!2sMED%20Seminar%20Hall%20Main%20Building!5e0!3m2!1sen!2sin!4v1758318100101!5m2!1sen!2sin"
};

// Inline events data (replaces fetching from events.json or API)
const INLINE_EVENTS = [
  {
    id: "yess-1",
    title: "GAMING HUB",
    description: "",
    venue: "CREATIVE ZONE",
    location: "CREATIVE ZONE",
    speaker: "",
  },
  {
    id: "yess-2",
    title:
      "CARNIVAL (HOOP THROW, CUP PYRAMID, REFLEX ROD DROP, TYRE TOSS, CUP BOWLING, SANDBAG TOSS)",
    description: "",
    venue: "NEAR ABC",
    location: "NEAR ABC",
    speaker: "",
  },
  {
    id: "yess-3",
    title: "IEEE YESS 2025 INAUGURATION",
    description: "",
    venue: "OAT",
    location: "OAT",
    speaker: "",
  },
  {
    id: "yess-4",
    title: "MYOSA EXHIBITION (IEEE SENSORS COUNCIL)",
    description: "",
    venue: "ELHC 201",
    location: "ELHC 201",
    speaker: "",
  },
  {
    id: "yess-5",
    title:
      "MENTOR MATCH 2.0 - INDUSTRY CO SPONSORED MENTORSHIP (IEEE YP KERALA)",
    description: "",
    venue: "MED SEMINAR HALL",
    location: "MED SEMINAR HALL",
    speaker: "",
  },
  {
    id: "yess-6",
    title: "CADENCE WORKSHOP & COMPETITION (IEEE CASS KERALA CHAPTER)",
    description: "",
    venue: "NLHC 201, 202, 203,204",
    location: "NLHC 201, 202, 203,204",
    speaker: "",
  },
  {
    id: "yess-7",
    title: "ROBOXHIBIT 2025 (IEEE RAS KERALA CHAPTER)",
    description: "",
    venue: "ELHC 301",
    location: "ELHC 301",
    speaker: "",
  },
  {
    id: "yess-8",
    title: "WEB APPLICATION PENETRATION TESTING(CYBERNIX)",
    description: "",
    venue: "ELHC 403",
    location: "ELHC 403",
    speaker: "",
  },
  {
    id: "yess-9",
    title: "TECH DEBATE COMPETITION",
    description: "",
    venue: "ELHC 102",
    location: "ELHC 102",
    speaker: "",
  },
  {
    id: "yess-10",
    title: "ASTROGALLERY(IEEE AESS KERALA CHAPTER)",
    description: "",
    venue: "AUDITORIUM",
    location: "AUDITORIUM",
    speaker: "",
  },
  {
    id: "yess-11",
    title: "NANOVNA EXHIBITION (IEEE MTT-S KERALA CHAPTER AND IEEE SB GECBH)",
    description: "",
    venue: "AUDITORIUM",
    location: "AUDITORIUM",
    speaker: "",
  },
  {
    id: "yess-12",
    title: "HUMANITARIAN PROJECT EXPO 2025 (IEEE SIGHT KERALA)",
    description: "",
    venue: "AUDITORIUM",
    location: "AUDITORIUM",
    speaker: "",
  },
  {
    id: "yess-13",
    title: "LEVELUP - GAMIFIED LMS (UNYS)",
    description: "",
    venue: "AUDITORIUM",
    location: "AUDITORIUM",
    speaker: "",
  },
  {
    id: "yess-14",
    title: "HP GAMING LAP EXPO (IEEE CS KERALA CHAPTER)",
    description: "",
    venue: "AUDITORIUM",
    location: "AUDITORIUM",
    speaker: "",
  },
  {
    id: "yess-15",
    title: "DEBUG ME CHALLENGE (IEEE CS KERALA CHAPTER)",
    description: "",
    venue: "AUDITORIUM",
    location: "AUDITORIUM",
    speaker: "",
  },
  {
    id: "yess-16",
    title:
      "SAKUSEII: HANDS ON WORKSHOP ON PROJECT PROPOSAL (IEEE LMAG AND SSIT KERALA)",
    description: "",
    venue: "AUDITORIUM",
    location: "AUDITORIUM",
    speaker: "",
  },
  {
    id: "yess-17",
    title: "BOARD GAMES",
    description: "",
    venue: "CREATIVE ZONE",
    location: "CREATIVE ZONE",
    speaker: "",
  },
  {
    id: "yess-18",
    title: "WIE CHAIRS MEET (IEEE WIE KERALA)",
    description: "",
    venue: "ECED BLOCK 2 SEMINAR HALL",
    location: "ECED BLOCK 2 SEMINAR HALL",
    speaker: "",
  },
  {
    id: "yess-19",
    title: "AEROFLIGHT (IEEEAESS KERALA CHAPTER)",
    description: "",
    venue: "ELHC 402",
    location: "ELHC 402",
    speaker: "",
  },
  {
    id: "yess-20",
    title: "ESCAPE ROOM",
    description: "",
    venue: "NLHC 301",
    location: "NLHC 301",
    speaker: "",
  },
  {
    id: "yess-21",
    title: "AURORA(IEEE PHOTONICS KERALA CHAPTER)",
    description: "",
    venue: "ELHC 302",
    location: "ELHC 302",
    speaker: "",
  },
  {
    id: "yess-22",
    title: "AGRINEXT:AI,PRECISION & THE FUTURE OF FARMING(KRISHI MITHRA)",
    description: "",
    venue: "DB 311",
    location: "DB 311",
    speaker: "",
  },
  {
    id: "yess-23",
    title: "TECHSPARK PROJECT DEMONSTRATION (IEEE COMSOC KERALA CHAPTER)",
    description: "",
    venue: "AUDITORIUM",
    location: "AUDITORIUM",
    speaker: "",
  },
  {
    id: "yess-24",
    title: "NEXTGEN INNOWARE",
    description: "",
    venue: "CHANAKYA HALL",
    location: "CHANAKYA HALL",
    speaker: "",
  },
  {
    id: "yess-25",
    title: "NEXA - SPS PROJECT EXPO (IEEE SPS KERALA PROJECT)",
    description: "",
    venue: "NLHC GROUND FLOOR",
    location: "NLHC GROUND FLOOR",
    speaker: "",
  },
  {
    id: "yess-26",
    title: "PROTOTYPE OR STILL MODELLING SHOWCASE",
    description: "",
    venue: "AMPHITHEATRE",
    location: "AMPHITHEATRE",
    speaker: "",
  },
  {
    id: "yess-27",
    title: "NITC TECHNICAL CLUB STALLS",
    description: "",
    venue: "FOOTBALL GROUND",
    location: "FOOTBALL GROUND",
    speaker: "",
  },
  {
    id: "yess-28",
    title: "COMPANY EXHIBITION",
    description: "",
    venue: "AUDITORIUM",
    location: "AUDITORIUM",
    speaker: "",
  },
  {
    id: "yess-29",
    title: "DRONE EXHIBITION (IEEE CSS KERALA CHAPTER)",
    description: "",
    venue: "AUDITORIUM",
    location: "AUDITORIUM",
    speaker: "",
  },
  {
    id: "yess-30",
    title: "RISAIKURU (IEEE PIE KERALA SECTION)",
    description: "",
    venue: "EED SEMINAR HALL",
    location: "EED SEMINAR HALL",
    speaker: "",
  },
  {
    id: "yess-31",
    title: "CHAMPIONS OF THE DEEP (IEEE OCEANIC SOCIETY KERALA CHAPTER)",
    description: "",
    venue: "AUDITORIUM",
    location: "AUDITORIUM",
    speaker: "",
  },
  {
    id: "yess-32",
    title: "TURING COMPETITION",
    description: "",
    venue: "ELHC 203",
    location: "ELHC 203",
    speaker: "",
  },
  {
    id: "yess-33",
    title: "TECHCORE: WORKSHOP ON AGENTIC AI (IEEE EDSOC KERALA CHAPTER)",
    description: "",
    venue: "NLHC 103",
    location: "NLHC 103",
    speaker: "",
  },
  {
    id: "yess-34",
    title: "PRO2 (IEEE SB CE KARUNAGAPALLY)",
    description: "",
    venue: "NLHC 101",
    location: "NLHC 101",
    speaker: "",
  },
  {
    id: "yess-35",
    title: "MINDMESH: BRAIN-COMPUTER INTERFACE (BCI) PLAYGROUND (IEEE SB RSET)",
    description: "",
    venue: "ELHC 104",
    location: "ELHC 104",
    speaker: "",
  },
  {
    id: "yess-36",
    title:
      "TECHXHIBIT: IEEE MACE SB IN ACTION AND SHOW YOUR INNOVATION (EXHIBIT) (IEEE VTS KERALA CHAPTER)",
    description: "",
    venue: "ELHC 202",
    location: "ELHC 202",
    speaker: "",
  },
  {
    id: "yess-37",
    title:
      "RISE OF AGENTIC MACHINES: HANDS-ON WORKSHOP ON AI AUTOMATION (IEEE SB ADOOR)",
    description: "",
    venue: "ELHC 103",
    location: "ELHC 103",
    speaker: "",
  },
  {
    id: "yess-38",
    title: "CIRCUIT BOULEVARD: A CIRCUIT ARCADE (IEEE SSCS KERALA CHAPTER)",
    description: "",
    venue: "ELHC 401",
    location: "ELHC 401",
    speaker: "",
  },
  {
    id: "yess-39",
    title: "VIBE CODING SESSION",
    description: "",
    venue: "MAIN BUILDING 109",
    location: "MAIN BUILDING 109",
    speaker: "",
  },
  {
    id: "yess-40",
    title: "UI/UX WORKSHOP (FOF KOZHIKODE)",
    description: "",
    venue: "ELHC 302",
    location: "ELHC 302",
    speaker: "",
  },
  {
    id: "yess-41",
    title: "TAG RACE (IEEE SB GEC KANNUR)",
    description: "",
    venue: "DB 311",
    location: "DB 311",
    speaker: "",
  },
  {
    id: "yess-42",
    title: "TECHCORE: INTRODUCTION TO CFD (IEEE EDSOC KERALA CHAPTER)",
    description: "",
    venue: "NLHC 302",
    location: "NLHC 302",
    speaker: "",
  },
  {
    id: "yess-43",
    title: "IEEE TEMS & PROCOMM JT. CHAPTER KERALA SECTION INAUGURATION",
    description: "",
    venue: "ARYABHATTA HALL",
    location: "ARYABHATTA HALL",
    speaker: "",
  },
  {
    id: "yess-44",
    title: "QUICK START TO RFID TECHNOLOGY (SLOT 1) (CRFID KERALA SECTION)",
    description: "",
    venue: "MED SEMINAR HALL",
    location: "MED SEMINAR HALL",
    speaker: "",
  },
  {
    id: "yess-45",
    title:
      "SOCIETY INAUGURATION - SENSOR COUNCIL, AESS, IES, SIGHT (IEEE SB NITC)",
    description: "",
    venue: "VLSI LAB",
    location: "VLSI LAB",
    speaker: "",
  },
  {
    id: "yess-46",
    title: "PATRONUS: SELF DEFENSE WORKSHOP (IEEE WIE KERALA)",
    description: "",
    venue: "NLHC 104",
    location: "NLHC 104",
    speaker: "",
  },
  {
    id: "yess-47",
    title: "MIC CHECK",
    description: "",
    venue: "OAT",
    location: "OAT",
    speaker: "",
  },
  {
    id: "yess-48",
    title:
      "INNOVATION PITCH CORNER (IEEE IA/IE/PELS JT. CHAPTER KERALA SECTION)",
    description: "",
    venue: "ELHC 101",
    location: "ELHC 101",
    speaker: "",
  },
  {
    id: "yess-49",
    title: "DATA ANALYTICS & BUSINESS INTELLIGENCE (TRANSEDUVERSE)",
    description: "",
    venue: "ELHC 403",
    location: "ELHC 403",
    speaker: "",
  },
  {
    id: "yess-50",
    title:
      "TECHCORE: INTRODUCTION TO EMBEDDED SYSTEM USING ESP 32 (IEEE EDSOC KERALA CHAPTER)",
    description: "",
    venue: "NLHC 103",
    location: "NLHC 103",
    speaker: "",
  },
  {
    id: "yess-51",
    title: "CIRCUIT CLASH (IEEE SB TOCH)",
    description: "",
    venue: "CADCAM LAB",
    location: "CADCAM LAB",
    speaker: "",
  },
  {
    id: "yess-52",
    title: "FLIGHT-101(NUKE LABS)",
    description: "",
    venue: "ELHC 301",
    location: "ELHC 301",
    speaker: "",
  },
  {
    id: "yess-53",
    title: "CEO'S PANEL DISCUSSION",
    description: "",
    venue: "ARYABHATTA HALL",
    location: "ARYABHATTA HALL",
    speaker: "",
  },
  {
    id: "yess-54",
    title: "MYOSA EXHIBITION (IEEE SENSORS COUNCIL)",
    description: "",
    venue: "ELHC 201",
    location: "ELHC 201",
    speaker: "",
  },
  {
    id: "yess-55",
    title: "QUICK START TO RFID TECHNOLOGY (SLOT 2) (CRFID KERALA SECTION)",
    description: "",
    venue: "MED SEMINAR HALL",
    location: "MED SEMINAR HALL",
    speaker: "",
  },
  {
    id: "yess-56",
    title:
      "MENTOR MATCH 2.0 - INDUSTRY CO SPONSORED MENTORSHIP (IEEE YP KERALA)",
    description: "",
    venue: "NLHC 201, 202, 203,204",
    location: "NLHC 201, 202, 203,204",
    speaker: "",
  },
  {
    id: "yess-57",
    title: "CADENCE WORKSHOP & COMPETITION (IEEE CASS KERALA CHAPTER)",
    description: "",
    venue: "VLSI LAB",
    location: "VLSI LAB",
    speaker: "",
  },
  {
    id: "yess-58",
    title: "3D PRINTING WORKSHOP",
    description: "",
    venue: "CHANAKYA HALL",
    location: "CHANAKYA HALL",
    speaker: "",
  },
  {
    id: "yess-59",
    title:
      "YESSPLORA: AR TREASURE HUNT (IEEE PES KERALA CHAPTER AND IEEE SB GEC KOZHIKODE)",
    description: "",
    venue: "ELHC 102",
    location: "ELHC 102",
    speaker: "",
  },
  {
    id: "yess-60",
    title: "WAVELINK (IEEE SB CUSAT & IEEE MTTS KS)",
    description: "",
    venue: "EED SEMINAR HALL",
    location: "EED SEMINAR HALL",
    speaker: "",
  },
  {
    id: "yess-61",
    title: "INTEGRATION BEE",
    description: "",
    venue: "NLHC 103",
    location: "NLHC 103",
    speaker: "",
  },
  {
    id: "yess-62",
    title: "ENTREPRENEURSHIP WORKSHOP",
    description: "",
    venue: "ELHC 402",
    location: "ELHC 402",
    speaker: "",
  },
  {
    id: "yess-63",
    title:
      "HACK A WEBSITE LIKE A PRO (IEEE KERALA SECTION WEB COORDINATION TEAM)",
    description: "",
    venue: "NLHC 301",
    location: "NLHC 301",
    speaker: "",
  },
  {
    id: "yess-64",
    title: "AERO-RELIEF(IEEE CSS KERALA CHAPTER)",
    description: "",
    venue: "NLHC 302",
    location: "NLHC 302",
    speaker: "",
  },
  {
    id: "yess-65",
    title: "MENTALISM (IEEE WIE KERALA)",
    description: "",
    venue: "BHASKARA HALL",
    location: "BHASKARA HALL",
    speaker: "",
  },
  {
    id: "yess-66",
    title: "SPIN FIESTA (IEEE CS KERALA CHAPTER)",
    description: "",
    venue: "AUDITORIUM",
    location: "AUDITORIUM",
    speaker: "",
  },
  {
    id: "yess-67",
    title: "ETCH YOUR PCB: PCB ETCHING AND DESIGNING WORKSHOP (IEEE SB GECT)",
    description: "",
    venue: "ELHC 104",
    location: "ELHC 104",
    speaker: "",
  },
  {
    id: "yess-68",
    title: "SECRET SQUAD OF SOLVERS (IEEE PUZZLERS)",
    description: "",
    venue: "KHOKHO COURT",
    location: "KHOKHO COURT",
    speaker: "",
  },
  {
    id: "yess-69",
    title: "TAG RACE (IEEE SB GEC KANNUR)",
    description: "",
    venue: "DB 311",
    location: "DB 311",
    speaker: "",
  },
  {
    id: "yess-70",
    title: "YOUTUBER CONCLAVE(SENTHIL)",
    description: "",
    venue: "OAT",
    location: "OAT",
    speaker: "",
  },
  {
    id: "yess-71",
    title: "ENERGY CONSERVATION IN DESIGN",
    description: "",
    venue: "NLHC 301",
    location: "NLHC 301",
    speaker: "",
  },
  {
    id: "yess-72",
    title: "GAME NIGHT(ADIZYA EVENT)",
    description: "",
    venue: "ELHC 102",
    location: "ELHC 102",
    speaker: "",
  },
  {
    id: "yess-73",
    title: "VALEDICTORY",
    description: "",
    venue: "ARYABHATTA HALL",
    location: "ARYABHATTA HALL",
    speaker: "",
  },
  {
    id: "yess-74",
    title: "FPV DRONE SHOW (IEEE CSS KERALA CHAPTER)",
    description: "",
    venue: "FOOTBALL GROUND",
    location: "FOOTBALL GROUND",
    speaker: "",
  },
  {
    id: "yess-75",
    title: "PRO SHOW: ANJU JOSEPH",
    description: "",
    venue: "OAT",
    location: "OAT",
    speaker: "",
  },
];

function Venue() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState("");
  const [selectedEventId, setSelectedEventId] = useState(null);
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
  // Events are no longer sorted by time
  eventsForSelectedVenue.sort((a, b) => a.title.localeCompare(b.title));

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

  const listToRender = events;

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
                Select a venue to view all scheduled events and location on map.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-1">
                <div className="bg-black/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-4">
                  <div className="mt-2 text-sm text-gray-300">
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
