*Playload*

```jsx

              
{
    "methodName": "GetTokenExpiration",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317"
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": {
      "id": "329",
      "expiration": "03/31/2020"
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "RenewExpiredToken",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317"
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": {
      "token_key": "eb58c3668d7d59a66033770614f3b325",
      "token_secret": "67f94ddfb30fab534c0a945ce660ded1b159f428",
      "startdate": "11/20/2019",
      "enddate": "02/20/2020"
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "GetCountriesList",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317"
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": {
      "countries": {
        "name": null,
        "description": null
      }
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "GetCustomVacationQuote",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317",
        "hash": "",
        "quote_hash": "",
        "show_room_name": 1,
        "use_default_room_type": 1
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": {
      "creation_date": null,
      "email": null,
      "first_name": null,
      "last_name": null,
      "phone": null,
      "extra_notes": null,
      "confirmation_id": null,
      "startdate": null,
      "enddate": null,
      "days_number": null,
      "occupants": null,
      "occupants_small": null,
      "lead_agent_id": null,
      "lead_agent_first_name": null,
      "lead_agent_last_name": null,
      "lead_agent_phone": null,
      "lead_agent_email": null,
      "lead_agent_description": null,
      "reservations": "\n    "
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "GetGuestReviews",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317",
        "housekeeper_id": 238975,
        "unit_id": 289687,
        "return_all": 1
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": {
      "reviews": {
        "review": {
          "id": "56054",
          "title": "Reservations Online Survey",
          "initial_text": "Thank you for your reservation. Please fill out our survey.",
          "company_id": "348",
          "full_name": null,
          "email": "sarah@test.com",
          "survey_id": "34",
          "reservation_id": "6777347",
          "unit_id": "28254",
          "housekeeper_id": "32197",
          "comments": "undefined",
          "creation_date": "03/10/2017 02:54:23",
          "travelagent_id": null,
          "status_id": "3",
          "show_in_owner_area": "1",
          "show_in_site": "1",
          "first_name": "Sarah",
          "last_name": "Test",
          "last_time_status_changed": "03/10/2017 02:54:48",
          "comments_for_web": null,
          "comments_for_owner": null,
          "published_on_twitter": "0",
          "published_on_facebook": "0",
          "madetype_id": "0",
          "reservation_cross_reference_code": null,
          "submit_date": null
        }
      }
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "GetPreReservationPrice",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317",
        "unit_id": 387743,
        "startdate": "01/10/2020",
        "enddate": "01/17/2020",
        "occupants": 2,
        "occupants_small": 2,
        "pets": 1,
        "apply_reward_points": 1,
        "coupon_code": "DISCOUNT",
        "madetype_id": 1,
        "type_id": 2,
        "pricing_model": 1,
        "optional_fee_XXXX": 1,
        "show_package_addons": 1,
        "optional_default_enabled": 1,
        "return_payments": "true",
        "payment_type_id": 1,
        "include_coupon_information": 1,
        "separate_taxes": 1,
        "guest_country_insurance_validation": "US",
        "guest_state_insurance_validation": "AZ",
        "return_new_pricing_model_and_rate_type": 1,
        "guest_deposits_show_all": 1,
        "show_due_today": 1
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": {
      "unit_id": "28254",
      "price": "4200",
      "taxes": "2831.88",
      "coupon_discount": "0.00",
      "total": "7031.88",
      "first_day_price": "940.80",
      "unit_name": "Home",
      "location_name": "Blue Creek Cabin",
      "unit_rewards": "1",
      "company_rewards": "1",
      "reward_points_discount": null,
      "guest_deposits": {
        "id": "26124",
        "value": "500.00",
        "name": "Guest Security Deposit",
        "due_today": "1",
        "deposit_required": "500.00"
      },
      "required_fees": [
        {
          "id": "28453",
          "name": "Pet Fee",
          "value": "500.00",
          "description": null,
          "damage_waiver": "0",
          "travel_insurance": "0",
          "cfar": "0"
        },
        {
          "id": "80113",
          "name": "Test Cleaning Fee",
          "value": "200.00",
          "description": "Owner Upcharge",
          "damage_waiver": "0",
          "travel_insurance": "0",
          "cfar": "0"
        },
        {
          "id": "112996",
          "name": null,
          "value": "35.00",
          "description": null,
          "damage_waiver": "0",
          "travel_insurance": "0",
          "cfar": "0"
        },
        {
          "id": "15116",
          "name": "State Tax",
          "value": "463.50",
          "description": "State Tax",
          "damage_waiver": "0",
          "travel_insurance": "0",
          "cfar": "0"
        },
        {
          "id": "80114",
          "name": "Test Processing Fee",
          "value": "36.00",
          "description": null,
          "damage_waiver": "0",
          "travel_insurance": "0",
          "cfar": "0"
        },
        {
          "id": "80132,80287",
          "name": "HAXML",
          "value": "250",
          "description": "HAXML",
          "damage_waiver": "0",
          "travel_insurance": "0",
          "cfar": "0",
          "group_by_name": "1"
        },
        {
          "id": "87317",
          "name": "Scott Fee",
          "value": "510.00",
          "description": "Scott Fee",
          "damage_waiver": "0",
          "travel_insurance": "0",
          "cfar": "0",
          "group_by_name": "1"
        },
        {
          "id": "50012",
          "name": "IHF",
          "value": "219.38",
          "description": "IHF",
          "damage_waiver": "0",
          "travel_insurance": "0",
          "cfar": "0",
          "group_by_name": "1"
        }
      ],
      "optional_fees": [
        {
          "id": "15114",
          "name": "Travel Insurance",
          "value": "360.50",
          "description": "Rental Guardian Trip Insurance (optional)",
          "damage_waiver": "0",
          "travel_insurance": "1",
          "cfar": "0",
          "active": "0"
        },
        {
          "id": "27140",
          "name": "Kayak",
          "value": "70.00",
          "description": "Kayak",
          "damage_waiver": "0",
          "travel_insurance": "0",
          "cfar": "0",
          "active": "0"
        },
        {
          "id": "45095",
          "name": "Wireless Internet",
          "value": "5.00",
          "description": "Wireless Internet",
          "damage_waiver": "0",
          "travel_insurance": "0",
          "cfar": "0",
          "active": "0"
        },
        {
          "id": "41727",
          "name": "Cancel For Any Reason Insurance",
          "value": "613.13",
          "description": "TripHedge Cancel For Any Reason (optional)",
          "damage_waiver": "0",
          "travel_insurance": "0",
          "cfar": "1",
          "active": "0"
        },
        {
          "id": "15983",
          "name": "CSA Trip Insurance",
          "value": "508.22",
          "description": "CSA Trip Insurance (optional)",
          "damage_waiver": "0",
          "travel_insurance": "0",
          "cfar": "0",
          "active": "0"
        }
      ],
      "taxes_details": [
        {
          "id": "80108",
          "name": "Test State Tax",
          "value": "360.50",
          "description": null,
          "damage_waiver": "0",
          "travel_insurance": "0",
          "cfar": "0"
        },
        {
          "id": "80109",
          "name": "Test City Tax . !!!",
          "value": "257.50",
          "description": "Test City Tax",
          "damage_waiver": "0",
          "travel_insurance": "0",
          "cfar": "0"
        }
      ],
      "reservation_days": [
        {
          "date": "03/03/2018",
          "season_id": "13940293",
          "season": "Holiday Season",
          "price": "840.00",
          "extra": "0.00",
          "discount": "0"
        },
        {
          "date": "03/04/2018",
          "season_id": "13940293",
          "season": "Holiday Season",
          "price": "840.00",
          "extra": "0.00",
          "discount": "0"
        },
        {
          "date": "03/05/2018",
          "season_id": "13940293",
          "season": "Holiday Season",
          "price": "840.00",
          "extra": "0.00",
          "discount": "0"
        },
        {
          "date": "03/06/2018",
          "season_id": "13940293",
          "season": "Holiday Season",
          "price": "840.00",
          "extra": "0.00",
          "discount": "0"
        },
        {
          "date": "03/07/2018",
          "season_id": "13940293",
          "season": "Holiday Season",
          "price": "840.00",
          "extra": "0.00",
          "discount": "0"
        }
      ],
      "security_deposits": {
        "security_deposit": [
          {
            "ledger_id": "2901",
            "description": "Guest Security Deposit",
            "deposit_required": "500.00"
          },
          {
            "ledger_id": "2905",
            "description": "Guest Deposit",
            "deposit_required": "0.00"
          },
          {
            "ledger_id": "2934",
            "description": "Pet Fee Deposit #2",
            "deposit_required": "0.00"
          }
        ]
      },
      "security_deposit_text": "Security Deposit Required:",
      "due_today": "0"
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "GetReservationInfo",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317",
        "confirmation_id": 1605,
        "return_address": 1,
        "return_flags": 1,
        "show_owner_charges": 1,
        "show_taxes_and_fees": 1,
        "show_commission_information": 1,
        "return_payments": 1,
        "return_additional_fields": 1,
        "show_payments_folio_history": 1,
        "include_security_deposit": 1,
        "return_housekeeping_schedule": 1,
        "return_happystays_code": 1,
        "show_guest_feedback_url": 1
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": {
      "reservation": {
        "id": "8646528",
        "confirmation_id": "8788",
        "madetype_id": "9",
        "cross_reference_code": null,
        "tax_exempt": "0",
        "hash": "4b11ba4c7971aa801feb03ecf5ec1981",
        "pricing_model": "1",
        "client_id": "4435997",
        "creation_date": "09/18/2017 01:02:47",
        "startdate": "10/05/2018",
        "enddate": "10/08/2018",
        "occupants": "2",
        "occupants_small": "0",
        "pets": "0",
        "email": "test@test.com",
        "email1": null,
        "email2": null,
        "title": null,
        "first_name": "Darth",
        "middle_name": null,
        "last_name": "Vader",
        "address": null,
        "address2": null,
        "city": "Tempe",
        "zip": null,
        "country_id": "227",
        "state_id": null,
        "phone": null,
        "fax": null,
        "mobile_phone": null,
        "work_phone": null,
        "client_comments": "client comments",
        "days_number": "3",
        "maketype_name": "I",
        "maketype_description": "Internet Reservation",
        "type_name": "STA",
        "status_code": "***IGNORE-UNSUPPORTED***",
        "location_id": "16268",
        "condo_type_id": "18715",
        "coupon_id": null,
        "unit_id": "28254",
        "longterm_enabled": "1",
        "unit_name": "Home",
        "unit_code": "Blue Creek Cabin",
        "location_name": "Blue Creek Cabin",
        "lodging_type_id": "3",
        "condo_type_name": "3 Bedroom Blue Creek Cabin",
        "country_name": "US",
        "state_name": null,
        "price_nightly": "4200.00",
        "price_total": "7356.33",
        "price_paidsum": "0.00",
        "price_common": "7356.33",
        "price_balance": "7356.33",
        "coupon_code": null,
        "company_id": "348",
        "status_id": "5",
        "hear_about_name": "System default",
        "last_updated": "09/18/2017 01:40:16.323686 EDT",
        "commissioned_agent_name": null,
        "travelagent_name": null
      }
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "GetReservationPrice",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317",
        "confirmation_id": 329764,
        "optional_fee_XXXX": 1,
        "show_bundled_fees": 1,
        "show_security_deposit_information": 1,
        "show_resort_information": 1,
        "return_payments": 1,
        "zero_out_security_deposit": 1,
        "exclude_optional_fees_total_due": 1,
        "show_payments_folio_history": "true",
        "payment_type_id": 1,
        "updated_expected_charges": 1,
        "show_owner_charges": 1,
        "show_package_addons": 1,
        "check_insurance_eligibility": 1
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": {
      "reservation_id": "7331538",
      "unit_id": "216041",
      "startdate": "03/22/2017",
      "enddate": "03/30/2017",
      "occupants": "2",
      "occupants_small": "0",
      "pets": "0",
      "price": "5.00",
      "taxes": "1.20",
      "coupon_discount": "1328.24",
      "total": "540.00",
      "tax_exempt": "0",
      "unit_name": "Crystal Tower",
      "location_name": "Huntington Beach",
      "hear_about_id": "8579",
      "hear_about_name": "System default",
      "unit_rewards": "0",
      "company_rewards": "0",
      "reward_points_discount": "0",
      "first_day_price": "0.63",
      "required_fees": [
        {
          "id": "28453",
          "name": "Pet Fee",
          "value": "500.00",
          "description": null,
          "active": "1",
          "damage_waiver": "0",
          "travel_insurance": "0",
          "cfar": "0"
        },
        {
          "id": "112996",
          "name": null,
          "value": "35.00",
          "description": null,
          "active": "1",
          "damage_waiver": "0",
          "travel_insurance": "0",
          "cfar": "0"
        }
      ],
      "optional_fees": {
        "id": "45095",
        "name": "Wireless Internet",
        "value": "5.00",
        "description": "Wireless Internet",
        "active": "0",
        "damage_waiver": "0",
        "travel_insurance": "0",
        "cfar": "0"
      },
      "taxes_details": "\n        ",
      "reservation_days": [
        {
          "date": "03/22/2017",
          "season": "Simple Year Round Season",
          "price": "0.63",
          "extra": "0.00",
          "discount": "0",
          "original_cost": "0.00"
        },
        {
          "date": "03/23/2017",
          "season": "Simple Year Round Season",
          "price": "0.63",
          "extra": "0.00",
          "discount": "0",
          "original_cost": "0.00"
        },
        {
          "date": "03/24/2017",
          "season": "Simple Year Round Season",
          "price": "0.63",
          "extra": "0.00",
          "discount": "0",
          "original_cost": "0.00"
        },
        {
          "date": "03/25/2017",
          "season": "Simple Year Round Season",
          "price": "0.63",
          "extra": "0.00",
          "discount": "0",
          "original_cost": "0.00"
        },
        {
          "date": "03/26/2017",
          "season": "Simple Year Round Season",
          "price": "0.63",
          "extra": "0.00",
          "discount": "0",
          "original_cost": "0.00"
        },
        {
          "date": "03/27/2017",
          "season": "Simple Year Round Season",
          "price": "0.63",
          "extra": "0.00",
          "discount": "0",
          "original_cost": "0.00"
        },
        {
          "date": "03/28/2017",
          "season": "Simple Year Round Season",
          "price": "0.63",
          "extra": "0.00",
          "discount": "0",
          "original_cost": "0.00"
        },
        {
          "date": "03/29/2017",
          "season": "Simple Year Round Season",
          "price": "0.59",
          "extra": "0.00",
          "discount": "0",
          "original_cost": "0.00"
        }
      ],
      "security_deposits": {
        "security_deposit": [
          {
            "ledger_id": "2901",
            "description": "Guest Security Deposit",
            "deposit_required": "0.00"
          },
          {
            "ledger_id": "2905",
            "description": "Guest Deposit",
            "deposit_required": "0.00"
          },
          {
            "ledger_id": "2934",
            "description": "Pet Fee Deposit #2",
            "deposit_required": "0.00"
          }
        ]
      },
      "security_deposit_text": "Security Deposit Required:",
      "due_today": "6.76"
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "GetReservations",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317",
        "return_full": 1,
        "modified_since": "2023-01-01",
        "last_updated": "2022-11-01T20:12:31-0700",
        "last_updated_utc": "2024-06-15T20:12:31",
        "check_in": 1,
        "check_out": 1,
        "show_cancellation_time": 1,
        "page_number": 1,
        "hear_about_name": "website",
        "show_commission_information": 1,
        "show_taxes_and_fees": 1,
        "creation_date": "2021-12-07",
        "show_iso_timezone": 1,
        "show_lead_queue_type": 1,
        "show_flags": 1
    }
}
            
```

**Response**

```jsx

              
{
  "data": {
    "reservations": [
      {
        "confirmation_id": "2762",
        "check_in": "00:30",
        "check_out": "01:45"
      },
      {
        "confirmation_id": "2760",
        "check_in": "00:30",
        "check_out": "01:45"
      },
      {
        "confirmation_id": "2759",
        "check_in": "00:30",
        "check_out": "01:45"
      },
      {
        "confirmation_id": "2763",
        "check_in": "00:30",
        "check_out": "01:45"
      },
      {
        "confirmation_id": "2756",
        "check_in": "00:30",
        "check_out": "01:45"
      },
      {
        "confirmation_id": "2742",
        "check_in": "00:30",
        "check_out": "01:45"
      },
      {
        "confirmation_id": "2743",
        "check_in": "00:30",
        "check_out": "01:45"
      },
      {
        "confirmation_id": "2722",
        "check_in": "00:30",
        "check_out": "01:45"
      },
      {
        "confirmation_id": "2739",
        "check_in": "00:30",
        "check_out": "01:45"
      },
      {
        "confirmation_id": "2740",
        "check_in": "00:30",
        "check_out": "01:45"
      },
      {
        "confirmation_id": "2750",
        "check_in": "00:30",
        "check_out": "01:45"
      },
      {
        "confirmation_id": "2753",
        "check_in": "00:30",
        "check_out": "01:45"
      },
      {
        "confirmation_id": "2737",
        "check_in": "00:30",
        "check_out": "01:45"
      },
      {
        "confirmation_id": "2745",
        "check_in": "00:30",
        "check_out": "01:45"
      },
      {
        "confirmation_id": "2744",
        "check_in": "00:30",
        "check_out": "01:45"
      },
      {
        "confirmation_id": "2746",
        "check_in": "00:30",
        "check_out": "01:45"
      }
    ]
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "MakeReservation",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317",
        "unit_id": "",
        "startdate": "",
        "enddate": "",
        "email": "",
        "occupants": "",
        "first_name": "",
        "last_name": "",
        "zip": 90210,
        "madetype_id": 9,
        "type_id": 2,
        "payment_type_id": 1,
        "status_id": 9,
        "amenity_addon": {
            "amenity_id": 458769,
            "amenity_quantity": 2
        },
        "flags": {
            "flag_id": 2
        },
        "credit_card_amount": 0.99,
        "credit_card_type_id": 2,
        "credit_card_number": 4111111111111111,
        "credit_card_expiration_year": 2025,
        "credit_card_expiration_month": 6,
        "credit_card_cid": 123,
        "bank_account_number": 1,
        "bank_routing_number": 1,
        "credit_card_charge_required": 1,
        "travelagent_id": 456789,
        "coupon_code": "couponCode",
        "referrer_url": "https://www.url.com",
        "payment_comments": "Paid via check"
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": {
      "reservation": {
        "confirmation_id": "8787",
        "location_name": "Blue Creek Cabin",
        "condo_type_name": "5 bedroom Blue Creek Cabin",
        "unit_name": "Blue Creek Cabin",
        "startdate": "10/05/2018",
        "enddate": "10/08/2018",
        "occupants": "2",
        "occupants_small": "0",
        "pets": "0",
        "price_common": "7356.33",
        "price_balance": "7356.33",
        "travelagent_name": null
      }
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "GetAmenities",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317",
        "use_and_logic": 1,
        "return_units_count": 1,
        "happy_stays": 1
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": {
      "amenities": [
        {
          "id": "170106",
          "group_name": "Amenities",
          "name": "Internet"
        },
        {
          "id": "170102",
          "group_name": "Amenities",
          "name": "Fireplace"
        },
        {
          "id": "170101",
          "group_name": "Amenities",
          "name": "Wood Stove"
        },
        {
          "id": "170100",
          "group_name": "Amenities",
          "name": "Air Conditioning"
        },
        {
          "id": "170099",
          "group_name": "Amenities",
          "name": "Heating"
        },
        {
          "id": "170105",
          "group_name": "Amenities",
          "name": "Washer"
        },
        {
          "id": "170104",
          "group_name": "Amenities",
          "name": "Dryer"
        },
        {
          "id": "170098",
          "group_name": "Amenities",
          "name": "Parking"
        },
        {
          "id": "170108",
          "group_name": "Amenities",
          "name": "Garage"
        },
        {
          "id": "170092",
          "group_name": "Amenities",
          "name": "Telephone"
        },
        {
          "id": "170091",
          "group_name": "Amenities",
          "name": "Living Room"
        }
      ]
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "GetNeighborhoodsList",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317"
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": {
      "neighborhood": [
        {
          "id": "8608",
          "name": "Area",
          "description": null
        },
        {
          "id": "8609",
          "name": "Arizona",
          "description": null
        },
        {
          "id": "5384",
          "name": "Corolla",
          "description": null
        },
        {
          "id": "8610",
          "name": "Deer Valley",
          "description": null
        },
        {
          "id": "3487",
          "name": "Downtown",
          "description": null
        },
        {
          "id": "8605",
          "name": "Downtown Gotham",
          "description": null
        },
        {
          "id": "2339",
          "name": "Fisherman's Wharf",
          "description": null
        },
        {
          "id": "8604",
          "name": "Gotham Hills",
          "description": null
        },
        {
          "id": "8611",
          "name": "Huntington BEach",
          "description": null
        },
        {
          "id": "2337",
          "name": "La Jolla",
          "description": null
        },
        {
          "id": "2338",
          "name": "Malibu",
          "description": null
        },
        {
          "id": "2880",
          "name": "Mill Ave",
          "description": null
        },
        {
          "id": "5383",
          "name": "NAGS HD",
          "description": null
        },
        {
          "id": "6811",
          "name": "Neighborhood is another classification for the location of a uni",
          "description": null
        },
        {
          "id": "8612",
          "name": "New Test Area",
          "description": "New Test Area"
        },
        {
          "id": "2894",
          "name": "Saddle Mountain",
          "description": null
        },
        {
          "id": "3998",
          "name": "Suburbs",
          "description": null
        },
        {
          "id": "6414",
          "name": "Test Neighborhood Name",
          "description": null
        },
        {
          "id": "5094",
          "name": "The Aloha Suites",
          "description": null
        },
        {
          "id": "8607",
          "name": "Zaporozhye",
          "description": null
        }
      ]
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "GetPropertyAmenities",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317",
        "unit_id": ""
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": {
      "amenity": [
        {
          "group_name": "Amenities",
          "group_description": null,
          "amenity_name": "Internet",
          "amenity_description": null,
          "amenity_id": "170106",
          "amenity_show_on_website": "yes"
        },
        {
          "group_name": "Amenities",
          "group_description": null,
          "amenity_name": "Air Conditioning",
          "amenity_description": null,
          "amenity_id": "170100",
          "amenity_show_on_website": "yes"
        },
        {
          "group_name": "Amenities",
          "group_description": null,
          "amenity_name": "Heating",
          "amenity_description": null,
          "amenity_id": "170099",
          "amenity_show_on_website": "yes"
        },
        {
          "group_name": "Amenities",
          "group_description": null,
          "amenity_name": "Washer",
          "amenity_description": null,
          "amenity_id": "170105",
          "amenity_show_on_website": "yes"
        },
        {
          "group_name": "Changeover/Arrival Day",
          "group_description": null,
          "amenity_name": "Arrival Day Flexible",
          "amenity_description": null,
          "amenity_id": "165279",
          "amenity_show_on_website": "yes"
        },
        {
          "group_name": "Suitability",
          "group_description": null,
          "amenity_name": "Children Ask",
          "amenity_description": null,
          "amenity_id": "170321",
          "amenity_show_on_website": "yes"
        },
        {
          "group_name": "Suitability",
          "group_description": null,
          "amenity_name": "Children Welcome",
          "amenity_description": null,
          "amenity_id": "170320",
          "amenity_show_on_website": "yes"
        },
        {
          "group_name": "Entertainment",
          "group_description": null,
          "amenity_name": "Television",
          "amenity_description": null,
          "amenity_id": "170291",
          "amenity_show_on_website": "yes"
        },
        {
          "group_name": "Pool/Spa",
          "group_description": null,
          "amenity_name": "Indoor Pool",
          "amenity_description": null,
          "amenity_id": "170218",
          "amenity_show_on_website": "yes"
        },
        {
          "group_name": "Pool/Spa",
          "group_description": null,
          "amenity_name": "Private Pool",
          "amenity_description": null,
          "amenity_id": "170215",
          "amenity_show_on_website": "yes"
        },
        {
          "group_name": "Kitchen and Dining",
          "group_description": null,
          "amenity_name": "Microwave",
          "amenity_description": null,
          "amenity_id": "170060",
          "amenity_show_on_website": "yes"
        },
        {
          "group_name": "Kitchen and Dining",
          "group_description": null,
          "amenity_name": "Coffee Maker",
          "amenity_description": null,
          "amenity_id": "170059",
          "amenity_show_on_website": "yes"
        },
        {
          "group_name": "Kitchen and Dining",
          "group_description": null,
          "amenity_name": "Dishwasher",
          "amenity_description": null,
          "amenity_id": "170063",
          "amenity_show_on_website": "yes"
        },
        {
          "group_name": "Outdoor",
          "group_description": null,
          "amenity_name": "Grill",
          "amenity_description": null,
          "amenity_id": "170110",
          "amenity_show_on_website": "yes"
        },
        {
          "group_name": "Accommodations",
          "group_description": null,
          "amenity_name": "Accommodation Type Bed and Breakfast",
          "amenity_description": null,
          "amenity_id": "170133",
          "amenity_show_on_website": "yes"
        },
        {
          "group_name": "Accommodations",
          "group_description": null,
          "amenity_name": "Other Services Chauffeur",
          "amenity_description": null,
          "amenity_id": "170125",
          "amenity_show_on_website": "yes"
        },
        {
          "group_name": "Sports and Adventure",
          "group_description": null,
          "amenity_name": "Mountaineering",
          "amenity_description": null,
          "amenity_id": "170186",
          "amenity_show_on_website": "yes"
        },
        {
          "group_name": "Sports and Adventure",
          "group_description": null,
          "amenity_name": "Scuba or Snorkeling",
          "amenity_description": null,
          "amenity_id": "170194",
          "amenity_show_on_website": "yes"
        },
        {
          "group_name": "Themes",
          "group_description": null,
          "amenity_name": "Family",
          "amenity_description": null,
          "amenity_id": "170212",
          "amenity_show_on_website": "yes"
        },
        {
          "group_name": "Themes",
          "group_description": null,
          "amenity_name": "Adventure",
          "amenity_description": null,
          "amenity_id": "170208",
          "amenity_show_on_website": "yes"
        },
        {
          "group_name": "Car",
          "group_description": null,
          "amenity_name": "Recommended",
          "amenity_description": null,
          "amenity_id": "170224",
          "amenity_show_on_website": "yes"
        },
        {
          "group_name": "Location Types",
          "group_description": null,
          "amenity_name": "Ocean View",
          "amenity_description": null,
          "amenity_id": "170228",
          "amenity_show_on_website": "yes"
        },
        {
          "group_name": "Attractions",
          "group_description": null,
          "amenity_name": "Ruins",
          "amenity_description": null,
          "amenity_id": "170263",
          "amenity_show_on_website": "yes"
        },
        {
          "group_name": "Leisure",
          "group_description": null,
          "amenity_name": "Whale Watching",
          "amenity_description": null,
          "amenity_id": "170327",
          "amenity_show_on_website": "yes"
        },
        {
          "group_name": "Local Features",
          "group_description": null,
          "amenity_name": "Laundromat",
          "amenity_description": null,
          "amenity_id": "170359",
          "amenity_show_on_website": "yes"
        }
      ]
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "GetPropertyCustomFields",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317",
        "unit_id": 28253
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": {
      "field": [
        {
          "field_id": "270",
          "name": "Gate Code",
          "type": "oneline_string",
          "value": "11223344",
          "show_on_site": "yes"
        },
        {
          "field_id": "101",
          "name": "Driving Directions",
          "type": "multiline_string",
          "value": null,
          "show_on_site": "yes"
        },
        {
          "field_id": "271",
          "name": "Golf Cart",
          "type": "boolean",
          "value": "no",
          "show_on_site": "yes"
        },
        {
          "field_id": "592",
          "name": "Trash Pick Up Days",
          "type": "oneline_string",
          "value": null,
          "show_on_site": "yes"
        },
        {
          "field_id": "637",
          "name": "Random Text",
          "type": "multiline_string",
          "value": null,
          "show_on_site": "yes"
        },
        {
          "field_id": "1016",
          "name": "Housekeeper Packing Instructions",
          "type": "multiline_string",
          "value": null,
          "show_on_site": "no"
        },
        {
          "field_id": "1351",
          "name": "Trash Pick-Up",
          "type": "oneline_string",
          "value": null,
          "show_on_site": "yes"
        },
        {
          "field_id": "1454",
          "name": "Number of Vehicles",
          "type": "oneline_string",
          "value": null,
          "show_on_site": "yes"
        },
        {
          "field_id": "1734",
          "name": "Checkin Instructions",
          "type": "multiline_string",
          "value": null,
          "show_on_site": "no"
        },
        {
          "field_id": "1827",
          "name": "what to bring",
          "type": "oneline_string",
          "value": null,
          "show_on_site": "no"
        },
        {
          "field_id": "2325",
          "name": "Boolean",
          "type": "boolean",
          "value": "no",
          "show_on_site": "no"
        },
        {
          "field_id": "2678",
          "name": "Test Field",
          "type": "oneline_string",
          "value": null,
          "show_on_site": "no"
        },
        {
          "field_id": "2888",
          "name": "Extra Info",
          "type": "oneline_string",
          "value": null,
          "show_on_site": "no"
        },
        {
          "field_id": "3010",
          "name": "Toilet Paper Rolls",
          "type": "integer",
          "value": "0",
          "show_on_site": "no"
        },
        {
          "field_id": "3016",
          "name": "Contact Management",
          "type": "oneline_string",
          "value": null,
          "show_on_site": "no"
        },
        {
          "field_id": "3110",
          "name": "Hi Im a new field",
          "type": "oneline_string",
          "value": null,
          "show_on_site": "no"
        },
        {
          "field_id": "3314",
          "name": "Bath Towels",
          "type": "integer",
          "value": null,
          "show_on_site": "no"
        }
      ]
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "GetPropertyGalleryImages",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317",
        "unit_id": 28254
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": {
      "image": [
        {
          "id": "122912532",
          "description": null,
          "original_path": "https://web.streamlinevrs.com/pmt_common/unit_gallery/00/00/6E/original_122912532.jpeg",
          "image_path": "https://web.streamlinevrs.com/pmt_common/unit_gallery/00/00/6E/image_122912532.jpeg",
          "thumbnail_path": "https://web.streamlinevrs.com/pmt_common/unit_gallery/00/00/6E/thumbnail_122912532.jpeg"
        },
        {
          "id": "122912526",
          "description": null,
          "original_path": "https://web.streamlinevrs.com/pmt_common/unit_gallery/00/00/6E/original_122912526.jpeg",
          "image_path": "https://web.streamlinevrs.com/pmt_common/unit_gallery/00/00/6E/image_122912526.jpeg",
          "thumbnail_path": "https://web.streamlinevrs.com/pmt_common/unit_gallery/00/00/6E/thumbnail_122912526.jpeg"
        },
        {
          "id": "122912530",
          "description": "Living Room",
          "original_path": "https://web.streamlinevrs.com/pmt_common/unit_gallery/00/00/6E/original_122912530.jpeg",
          "image_path": "https://web.streamlinevrs.com/pmt_common/unit_gallery/00/00/6E/image_122912530.jpeg",
          "thumbnail_path": "https://web.streamlinevrs.com/pmt_common/unit_gallery/00/00/6E/thumbnail_122912530.jpeg"
        },
        {
          "id": "122912528",
          "description": null,
          "original_path": "https://web.streamlinevrs.com/pmt_common/unit_gallery/00/00/6E/original_122912528.jpeg",
          "image_path": "https://web.streamlinevrs.com/pmt_common/unit_gallery/00/00/6E/image_122912528.jpeg",
          "thumbnail_path": "https://web.streamlinevrs.com/pmt_common/unit_gallery/00/00/6E/thumbnail_122912528.jpeg"
        },
        {
          "id": "122912524",
          "description": null,
          "original_path": "https://web.streamlinevrs.com/pmt_common/unit_gallery/00/00/6E/original_122912524.jpeg",
          "image_path": "https://web.streamlinevrs.com/pmt_common/unit_gallery/00/00/6E/image_122912524.jpeg",
          "thumbnail_path": "https://web.streamlinevrs.com/pmt_common/unit_gallery/00/00/6E/thumbnail_122912524.jpeg"
        },
        {
          "id": "122912529",
          "description": null,
          "original_path": "https://web.streamlinevrs.com/pmt_common/unit_gallery/00/00/6E/original_122912529.jpeg",
          "image_path": "https://web.streamlinevrs.com/pmt_common/unit_gallery/00/00/6E/image_122912529.jpeg",
          "thumbnail_path": "https://web.streamlinevrs.com/pmt_common/unit_gallery/00/00/6E/thumbnail_122912529.jpeg"
        }
      ]
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "GetPropertyIndex",
    "params": {
        "token_key": "key",
        "token_secret": "secret",
        "unit_id": 288515,
        "show_on_web": 1,
        "price_updated_since": "2021-04-22T17:21:22Z",
        "reservations_updated_since": "2021-04-22T17:21:22Z",
        "content_updated_since": "2021-04-22T17:21:22Z",
        "show_advance_date": 1,
        "use_streamshare": 1,
        "separate_streamshare_units": 1
    }
}
            
```

**Response**

```jsx

              
{
  "data": {
    "units": {
      "unit": [
        {
          "id": "288515",
          "title": "Serenity",
          "unit_code": "Serenity",
          "last_update_prices": "2021-03-15T17:14:48Z",
          "last_update_reservations": "2021-03-11T10:43:30Z",
          "last_update_content": "2021-03-11T10:43:30Z"
        },
        {
          "id": "288517",
          "title": "Blue Creek Cabin",
          "unit_code": "Blue Creek Cabin",
          "last_update_prices": "2021-03-15T17:14:48Z",
          "last_update_reservations": "2021-03-14T15:09:37Z",
          "last_update_content": "2021-03-14T15:09:37Z"
        },
        {
          "id": "288518",
          "title": "Nirvana",
          "unit_code": "Nirvana",
          "last_update_prices": "2021-03-15T17:14:48Z",
          "last_update_reservations": "2021-03-12T11:34:43Z",
          "last_update_content": "2021-03-12T11:34:43Z"
        },
        {
          "id": "288520",
          "title": "Modern Mansion",
          "unit_code": "Modern Mansion",
          "last_update_prices": "2021-03-15T17:14:48Z",
          "last_update_reservations": "2021-03-15T15:11:17Z",
          "last_update_content": "2021-03-15T15:11:17Z"
        },
        {
          "id": "288531",
          "title": "Eutopia",
          "unit_code": "Eutopia",
          "last_update_prices": "2021-03-15T17:14:48Z",
          "last_update_reservations": "2021-03-15T15:11:17Z",
          "last_update_content": "2021-03-15T15:11:17Z"
        }
      ]
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "GetPropertyInfo",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317",
        "unit_id": 376806,
        "return_multiple_housekeepers": 1,
        "include_owners": 1,
        "owner_manager": 1,
        "maintenance_plan": 1,
        "unit_proposition_package": 1,
        "return_markup": 1,
        "show_advance_date": 1,
        "show_website_url": 1,
        "show_wifi_name": 1,
        "show_housekeeping_status": 1
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": {
      "id": "28254",
      "parent_id": null,
      "search_position": "3",
      "local_phone": "123-321-1234",
      "wifi_security_key": "Network: Resort_Pro  Password: Stream12345678987654321",
      "type_id": "1",
      "seo_title": "Streamline Demo Company: Blue Creek Cabin in Area 1",
      "seo_description": "Streamline Demo Company: Blue Creek Cabin in Area 1. Blue creek cabin demo description.",
      "seo_keywords": "Blue Creek Cabin, Blue Creek Cabin in Area 1,",
      "addition_seo_text": null,
      "mobile_seo_text": "Streamline Demo Company: Blue Creek Cabin in Area 1",
      "use_parent_different_owners_logic": "0",
      "floor": null,
      "sale_enabled": "1",
      "coupons_enabled": "1",
      "discounts_enabled": "1",
      "longterm_enabled": "1",
      "shortterm_enabled": "1",
      "location_id": "16268",
      "building_id": "16549",
      "condo_type_id": "18715",
      "name": "Home",
      "gallery_code": null,
      "status_id": "1",
      "image_ext": null,
      "thumbnail_ext": null,
      "unit_code": "Blue Creek Cabin",
      "max_adults": "10",
      "max_occupants": "12",
      "max_pets": "0",
      "virtual_tour_url": {
        "iframe": {
          "src": " http://www.virtually-anywhere.com/portfolio/lakeaustinspa/",
          "style": "height:600px; width: 100%;"
        }
      },
      "virtual_tour_image_overlay_url": "test 2",
      "google_map_overlay_url": null,
      "latitude": null,
      "longitude": null,
      "comment": "Demo Home Update Info",
      "housekeeping_processor_id": "32197",
      "location_latitude": "33.3502878",
      "location_longitude": "-111.9111680",
      "square_foots": "100000",
      "floor_plan_url": {
        "iframe": {
          "src": " https://chezerbey.files.wordpress.com/2009/08/plan_original_111710.jpg",
          "style": "height:600px; width: 100%;"
        }
      },
      "web_name": "Blue Creek Cabin",
      "status_name": "Active",
      "location_name": "Blue Creek Cabin",
      "company_id": "348",
      "lodging_type_id": "3",
      "location_area_id": "2309",
      "neighborhood_area_id": "2337",
      "resort_area_id": "2807",
      "home_type_id": "1011",
      "address": "7519 S. McClintock Dr. Suite 105",
      "city": "Tempe",
      "zip": "85283",
      "state_name": "AZ",
      "state_description": "Arizona",
      "country_name": "US",
      "location_area_name": "Huntington Beach",
      "neighborhood_name": "La Jolla",
      "location_resort_name": "Resort A",
      "short_description": "Used by XML/API sites. Not used for sites utilizing our WP plugin. test0",
      "location_image_ext": "jpeg",
      "condo_type_name": "3 Bedroom Blue Creek Cabin",
      "default_unit_id": null,
      "condo_type_group_id": "2755",
      "bathrooms_number": "5.5",
      "bedrooms_number": "5",
      "condo_type_group_name": "3 Bedroom",
      "building_short_name": "Def",
      "building_name": "Default",
      "images_number": "6",
      "owning_type_id": "1",
      "seo_page_name": "blue-creek-cabin",
      "view_name": "Pool View",
      "view_order": "0",
      "rating_count": "6",
      "rating_average": "74.17",
      "flyer_url": null,
      "owning_result_table_order": "0",
      "property_rating_name": null,
      "property_rating_points": null,
      "home_type": "Adobe",
      "email_quote_description": null,
      "description": "unit description",
      "global_description": "This description will show up on your units landing page within your website. test1",
      "floor_name": "Ground",
      "not_show_on_website": "0",
      "creation_date": "10/16/2013 02:33:33",
      "property_code": "BlueCreekCabin",
      "housekeeping_zone_id": null,
      "region": null,
      "community": null,
      "online_bookings": "1",
      "default_image_path": "https://web.streamlinevrs.com/pmt_common/d_images/location_image_16268.jpeg",
      "default_thumbnail_path": "https://web.streamlinevrs.com/pmt_common/d_images/location_thumbnail_16268.jpeg",
      "original_description": null,
      "variable_gate_code": "19458324",
      "variable_driving_directions": "Very Nice",
      "variable_golf_cart": "yes",
      "variable_trash_pick_up_days": "Monday",
      "variable_random_text": "Random Text. Blue Creek Cabin is a lodge with rare blue pine wood from the creek down the road known as the Blue Creek.\n \n          Blue Creek Cabin",
      "variable_trash_pick_up": "today",
      "variable_number_of_vehicles": "3",
      "location_variable_resort_field_1": null,
      "night_gap_logic_enabled": "yes",
      "night_gap_logic_minimal_nights": "1"
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "GetPropertyListWordPress",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317",
        "amenities_filter": 298019,
        "use_room_type_logic_with_homes": 1
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": {
      "property": {
        "id": null,
        "sale_enabled": null,
        "longterm_enabled": null,
        "shortterm_enabled": null,
        "rating_count": null,
        "rating_average": null,
        "property_rating_points": null,
        "flyer_url": null,
        "seo_page_name": null,
        "name": null,
        "location_name": null,
        "web_name": null,
        "short_description": null,
        "max_occupants": null,
        "bedrooms_number": null,
        "bathrooms_number": null,
        "condo_type_name": null,
        "condo_type_group_name": "m",
        "view_name": null,
        "floor_name": null,
        "resort_area_id": null,
        "resort_area_name": null,
        "location_area_id": null,
        "location_area_name": null,
        "neighborhood_area_id": null,
        "neighborhood_name": "a",
        "city": "Tempe",
        "max_adults": null,
        "max_pets": null,
        "lodging_type_id": null,
        "square_foots": null,
        "home_type": "Adobe",
        "latitude": null,
        "longitude": null,
        "location_latitude": null,
        "location_longitude": null,
        "location_comment": null,
        "property_code": null,
        "renting_type": "G",
        "price_data": {
          "daily": null
        },
        "price_str": null,
        "default_thumbnail_path": null,
        "default_image_path": null,
        "unit_amenities": {
          "amenity": {
            "group_name": null,
            "group_description": null,
            "amenity_name": null,
            "amenity_description": null,
            "amenity_id": null,
            "amenity_show_on_website": null
          }
        }
      }
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "GetPropertyRates",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317",
        "unit_id": "",
        "startdate": "02/15/2020",
        "enddate": "02/27/2020",
        "dailyChangeOver": 1,
        "use_homeaway_max_days_notice": 1,
        "rate_types": {
            "id": 429876
        },
        "show_los_if_enabled": "true",
        "max_los_stay": 90,
        "use_adv_logic_if_defined": "true"
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": [
      {
        "season": "Peak Season",
        "date": "2017-03-03",
        "rate": null,
        "minStay": "3",
        "booked": "0",
        "changeOver": "X"
      },
      {
        "season": "Peak Season",
        "date": "2017-03-04",
        "rate": null,
        "minStay": "3",
        "booked": "0",
        "changeOver": "X"
      },
      {
        "season": "Peak Season",
        "date": "2017-03-05",
        "rate": null,
        "minStay": "3",
        "booked": "0",
        "changeOver": "X"
      },
      {
        "season": "Peak Season",
        "date": "2017-03-06",
        "rate": null,
        "minStay": "3",
        "booked": "0",
        "changeOver": "X"
      },
      {
        "season": "Peak Season",
        "date": "2017-03-07",
        "rate": null,
        "minStay": "3",
        "booked": "0",
        "changeOver": "X"
      },
      {
        "season": "Peak Season",
        "date": "2017-03-08",
        "rate": null,
        "minStay": "3",
        "booked": "0",
        "changeOver": "X"
      },
      {
        "season": "Peak Season",
        "date": "2017-03-09",
        "rate": null,
        "minStay": "3",
        "booked": "0",
        "changeOver": "X"
      },
      {
        "season": "Peak Season",
        "date": "2017-03-10",
        "rate": null,
        "minStay": "3",
        "booked": "0",
        "changeOver": "X"
      },
      {
        "season": "Peak Season",
        "date": "2017-03-11",
        "rate": null,
        "minStay": "3",
        "booked": "0",
        "changeOver": "X"
      },
      {
        "season": "Peak Season",
        "date": "2017-03-12",
        "rate": null,
        "minStay": "3",
        "booked": "0",
        "changeOver": "X"
      },
      {
        "season": "Peak Season",
        "date": "2017-03-13",
        "rate": null,
        "minStay": "3",
        "booked": "0",
        "changeOver": "X"
      },
      {
        "season": "Peak Season",
        "date": "2017-03-14",
        "rate": null,
        "minStay": "3",
        "booked": "0",
        "changeOver": "X"
      },
      {
        "season": "Peak Season",
        "date": "2017-03-15",
        "rate": null,
        "minStay": "3",
        "booked": "0",
        "changeOver": "X"
      },
      {
        "season": "Peak Season",
        "date": "2017-03-16",
        "rate": null,
        "minStay": "3",
        "booked": "0",
        "changeOver": "X"
      },
      {
        "season": "Peak Season",
        "date": "2017-03-17",
        "rate": null,
        "minStay": "3",
        "booked": "0",
        "changeOver": "X"
      },
      {
        "season": "Peak Season",
        "date": "2017-03-18",
        "rate": null,
        "minStay": "3",
        "booked": "0",
        "changeOver": "X"
      },
      {
        "season": "Peak Season",
        "date": "2017-03-19",
        "rate": null,
        "minStay": "3",
        "booked": "0",
        "changeOver": "X"
      },
      {
        "season": "Peak Season",
        "date": "2017-03-20",
        "rate": null,
        "minStay": "3",
        "booked": "0",
        "changeOver": "X"
      },
      {
        "season": "Peak Season",
        "date": "2017-03-21",
        "rate": null,
        "minStay": "3",
        "booked": "0",
        "changeOver": "X"
      },
      {
        "season": "Peak Season",
        "date": "2017-03-22",
        "rate": null,
        "minStay": "3",
        "booked": "0",
        "changeOver": "X"
      },
      {
        "season": "Peak Season",
        "date": "2017-03-23",
        "rate": null,
        "minStay": "3",
        "booked": "0",
        "changeOver": "X"
      },
      {
        "season": "Peak Season",
        "date": "2017-03-24",
        "rate": null,
        "minStay": "3",
        "booked": "0",
        "changeOver": "X"
      }
    ]
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "GetPropertyRatesRawData",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317",
        "unit_id": "",
        "show_all_rates": 1,
        "startdate": "2020/08/10",
        "enddate": "2021/01/30"
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": {
      "rates": [
        {
          "season_id": "15566332",
          "season_name": "Spring",
          "period_name": "Spring 2018",
          "period_begin": "02/01/2018",
          "period_end": "05/31/2018",
          "narrow_defined_days": "6",
          "allow_coupons": "t",
          "daily_first_interval": "All Days",
          "daily_first_interval_price": "$364.00"
        },
        {
          "season_id": "13940293",
          "season_name": "Holiday Season",
          "period_name": "Winter",
          "period_begin": "06/01/2018",
          "period_end": "02/28/2019",
          "narrow_defined_days": "5",
          "allow_coupons": "t",
          "daily_first_interval": "Sunday-Thursday",
          "daily_first_interval_price": "$588.00",
          "daily_second_interval": "Friday-Saturday",
          "daily_second_interval_price": "$588.00",
          "weekly_price": "$1,612.00",
          "monthly_price": "$12,000.00"
        },
        {
          "season_id": "15566332",
          "season_name": "Spring",
          "period_name": "Spring 2019",
          "period_begin": "03/01/2019",
          "period_end": "05/31/2019",
          "narrow_defined_days": "6",
          "allow_coupons": "t",
          "daily_first_interval": "All Days",
          "daily_first_interval_price": "$364.00"
        },
        {
          "season_id": "13940293",
          "season_name": "Holiday Season",
          "period_name": "Winter",
          "period_begin": "06/01/2019",
          "period_end": "12/01/2019",
          "narrow_defined_days": "5",
          "allow_coupons": "t",
          "daily_first_interval": "Sunday-Thursday",
          "daily_first_interval_price": "$588.00",
          "daily_second_interval": "Friday-Saturday",
          "daily_second_interval_price": "$588.00",
          "weekly_price": "$1,612.00",
          "monthly_price": "$12,000.00"
        }
      ]
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "GetPropertyRoomDetails",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317",
        "unit_id": "",
        "room_notes": 1,
        "show_half_bathrooms": 1
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": {
      "room_details": [
        {
          "name": "Master Bedroom TEST",
          "group": {
            "name": "Bedroom Feature Values",
            "amenity": {
              "name": "King"
            }
          }
        },
        {
          "name": "Bedroom 2",
          "group": {
            "name": "Bedroom Feature Values",
            "amenity": [
              {
                "name": "Queen"
              },
              {
                "name": "Double"
              },
              {
                "name": "Twin Single"
              }
            ]
          }
        },
        {
          "name": "Bedroom 3",
          "group": {
            "name": "Bedroom Feature Values",
            "amenity": {
              "name": "Double"
            }
          }
        },
        {
          "name": "Bedroom 4",
          "group": {
            "name": "Bedroom Feature Values",
            "amenity": {
              "name": "King"
            }
          }
        },
        {
          "name": "Bedroom 5",
          "group": {
            "name": "Bedroom Feature Values",
            "amenity": {
              "name": "Double"
            }
          }
        },
        {
          "name": "Bathroom 1",
          "group": {
            "name": "Bathroom Feature Values",
            "amenity": [
              {
                "name": "Toilet"
              },
              {
                "name": "Shower"
              }
            ]
          }
        },
        {
          "name": "Bathroom 2",
          "group": {
            "name": "Bathroom Feature Values",
            "amenity": [
              {
                "name": "Toilet"
              },
              {
                "name": "Shower"
              }
            ]
          }
        },
        {
          "name": "Bathroom 3",
          "group": {
            "name": "Bathroom Feature Values",
            "amenity": [
              {
                "name": "Toilet"
              },
              {
                "name": "Shower"
              }
            ]
          }
        },
        {
          "name": "Bathroom 4",
          "group": {
            "name": "Bathroom Feature Values",
            "amenity": [
              {
                "name": "Toilet"
              },
              {
                "name": "Combo Tub Shower"
              },
              {
                "name": "Shower"
              }
            ]
          }
        },
        {
          "name": "Bathroom 5",
          "group": {
            "name": "Bathroom Feature Values",
            "amenity": [
              {
                "name": "Toilet"
              },
              {
                "name": "Shower"
              }
            ]
          }
        },
        {
          "name": "Bathroom 6",
          "group": {
            "name": "Bathroom Feature Values",
            "amenity": {
              "name": "Toilet"
            }
          }
        }
      ]
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "GetBlockedDaysForUnit",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317",
        "unit_id": 28254,
        "startdate": "12/05/2019",
        "display_b2b_blocks": "true"
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": {
      "blocked_days": {
        "blocked": [
          {
            "confirmation_id": "N/A",
            "startdate": "09/17/2017",
            "enddate": "09/19/2017",
            "checkout": "09/20/2017",
            "type_id": "30",
            "type_name": "MaintenanceBlock",
            "type_description": "Maintenance Block"
          },
          {
            "confirmation_id": "7508",
            "startdate": "09/20/2017",
            "enddate": "09/21/2017",
            "checkout": "09/22/2017",
            "type_id": "2",
            "type_name": "STA",
            "type_description": "Standard"
          },
          {
            "confirmation_id": "8726",
            "startdate": "09/23/2017",
            "enddate": "09/26/2017",
            "checkout": "09/27/2017",
            "type_id": "2",
            "type_name": "STA",
            "type_description": "Standard"
          },
          {
            "confirmation_id": "8428",
            "startdate": "09/28/2017",
            "enddate": "10/01/2017",
            "checkout": "10/02/2017",
            "type_id": "2",
            "type_name": "STA",
            "type_description": "Standard"
          },
          {
            "confirmation_id": "8714",
            "startdate": "10/18/2017",
            "enddate": "10/22/2017",
            "checkout": "10/23/2017",
            "type_id": "39",
            "type_name": "BPal-WHL",
            "type_description": "BPal-WHL"
          },
          {
            "confirmation_id": "8715",
            "startdate": "10/25/2017",
            "enddate": "10/29/2017",
            "checkout": "10/30/2017",
            "type_id": "39",
            "type_name": "BPal-WHL",
            "type_description": "BPal-WHL"
          },
          {
            "confirmation_id": "8585",
            "startdate": "01/06/2018",
            "enddate": "01/12/2018",
            "checkout": "01/13/2018",
            "type_id": "16",
            "type_name": "HAFamL",
            "type_description": "HAFamL"
          },
          {
            "confirmation_id": "8315",
            "startdate": "03/21/2018",
            "enddate": "03/28/2018",
            "checkout": "03/29/2018",
            "type_id": "191",
            "type_name": "VacaystayconnectWHL",
            "type_description": "VacaystayconnectWHL"
          },
          {
            "confirmation_id": "8316",
            "startdate": "04/17/2018",
            "enddate": "04/23/2018",
            "checkout": "04/24/2018",
            "type_id": "191",
            "type_name": "VacaystayconnectWHL",
            "type_description": "VacaystayconnectWHL"
          },
          {
            "confirmation_id": "8696",
            "startdate": "07/03/2018",
            "enddate": "08/28/2018",
            "checkout": "08/29/2018",
            "type_id": "66",
            "type_name": "ICAL",
            "type_description": "ICAL"
          },
          {
            "confirmation_id": "8713",
            "startdate": "08/29/2018",
            "enddate": "08/29/2018",
            "checkout": "08/30/2018",
            "type_id": "66",
            "type_name": "ICAL",
            "type_description": "ICAL"
          },
          {
            "confirmation_id": "8723",
            "startdate": "08/30/2018",
            "enddate": "08/30/2018",
            "checkout": "08/31/2018",
            "type_id": "66",
            "type_name": "ICAL",
            "type_description": "ICAL"
          },
          {
            "confirmation_id": "8733",
            "startdate": "08/31/2018",
            "enddate": "08/31/2018",
            "checkout": "09/01/2018",
            "type_id": "66",
            "type_name": "ICAL",
            "type_description": "ICAL"
          },
          {
            "confirmation_id": "8740",
            "startdate": "09/01/2018",
            "enddate": "09/01/2018",
            "checkout": "09/02/2018",
            "type_id": "66",
            "type_name": "ICAL",
            "type_description": "ICAL"
          },
          {
            "confirmation_id": "8749",
            "startdate": "09/02/2018",
            "enddate": "09/02/2018",
            "checkout": "09/03/2018",
            "type_id": "66",
            "type_name": "ICAL",
            "type_description": "ICAL"
          },
          {
            "confirmation_id": "8756",
            "startdate": "09/03/2018",
            "enddate": "09/03/2018",
            "checkout": "09/04/2018",
            "type_id": "66",
            "type_name": "ICAL",
            "type_description": "ICAL"
          },
          {
            "confirmation_id": "8765",
            "startdate": "09/04/2018",
            "enddate": "09/04/2018",
            "checkout": "09/05/2018",
            "type_id": "66",
            "type_name": "ICAL",
            "type_description": "ICAL"
          },
          {
            "confirmation_id": "8775",
            "startdate": "09/05/2018",
            "enddate": "09/05/2018",
            "checkout": "09/06/2018",
            "type_id": "66",
            "type_name": "ICAL",
            "type_description": "ICAL"
          },
          {
            "confirmation_id": "8016",
            "startdate": "12/01/2019",
            "enddate": "12/04/2019",
            "checkout": "12/05/2019",
            "type_id": "191",
            "type_name": "VacaystayconnectWHL",
            "type_description": "VacaystayconnectWHL"
          },
          {
            "confirmation_id": "8017",
            "startdate": "12/05/2019",
            "enddate": "12/09/2019",
            "checkout": "12/10/2019",
            "type_id": "191",
            "type_name": "VacaystayconnectWHL",
            "type_description": "VacaystayconnectWHL"
          }
        ]
      }
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "GetPropertyAvailability",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317",
        "startdate": "",
        "enddate": "",
        "occupants": "",
        "disable_minimal_days": 1,
        "show_total_units": 1
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": {
      "token_key": "cd7745ec2585802fb8542dd1dbb1dc32",
      "token_secret": "04dd76c93aad0e4fef4d2f76e38ece99cb99d836",
      "startdate": "09/03/2017",
      "enddate": "09/08/2017",
      "occupants": "2",
      "available_properties": {
        "property_id": [
          "28255",
          "45280",
          "131657",
          "32880",
          "248466",
          "83998",
          "221000",
          "37910",
          "226273",
          "69598",
          "209020",
          "28258",
          "34898",
          "28248",
          "226278",
          "226563",
          "216041",
          "248456",
          "278149",
          "31897",
          "31923",
          "65030",
          "69671",
          "82713",
          "82715",
          "200131",
          "232706",
          "200132",
          "28250",
          "45688",
          "28256",
          "241638",
          "98599",
          "28257",
          "42185",
          "28259"
        ]
      }
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "GetPropertyAvailabilityCalendarRawData",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317",
        "unit_id": "",
        "startdate": "01/01/1959",
        "enddate": ""
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": {
      "blocked_period": [
        {
          "startdate": "01/06/2018",
          "enddate": "01/12/2018",
          "reason": "Reservation #8585"
        },
        {
          "startdate": "03/21/2018",
          "enddate": "03/28/2018",
          "reason": "Reservation #8315"
        },
        {
          "startdate": "04/17/2018",
          "enddate": "04/23/2018",
          "reason": "Reservation #8316"
        },
        {
          "startdate": "07/03/2018",
          "enddate": "08/28/2018",
          "reason": "Reservation #8696"
        },
        {
          "startdate": "08/29/2018",
          "enddate": "08/29/2018",
          "reason": "Reservation #8713"
        },
        {
          "startdate": "08/30/2018",
          "enddate": "08/30/2018",
          "reason": "Reservation #8723"
        },
        {
          "startdate": "08/31/2018",
          "enddate": "08/31/2018",
          "reason": "Reservation #8733"
        },
        {
          "startdate": "09/01/2018",
          "enddate": "09/01/2018",
          "reason": "Reservation #8740"
        },
        {
          "startdate": "09/02/2018",
          "enddate": "09/02/2018",
          "reason": "Reservation #8749"
        },
        {
          "startdate": "09/03/2018",
          "enddate": "09/03/2018",
          "reason": "Reservation #8756"
        },
        {
          "startdate": "09/04/2018",
          "enddate": "09/04/2018",
          "reason": "Reservation #8765"
        },
        {
          "startdate": "09/05/2018",
          "enddate": "09/05/2018",
          "reason": "Reservation #8775"
        },
        {
          "startdate": "10/05/2018",
          "enddate": "10/07/2018",
          "reason": "Reservation #8788"
        },
        {
          "startdate": "12/01/2019",
          "enddate": "12/04/2019",
          "reason": "Reservation #8016"
        },
        {
          "startdate": "12/05/2019",
          "enddate": "12/09/2019",
          "reason": "Reservation #8017"
        }
      ]
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "GetPropertyAvailabilityWithRates",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317",
        "startdate": "",
        "enddate": "",
        "type_id": 2,
        "use_streamshare": 1,
        "use_bundled_fees_in_room_rate": 1,
        "use_guest_deposits": "true"
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": {
      "token_key": "cd7745ec2585802fb8542dd1dbb1dc32",
      "token_secret": "04dd76c93aad0e4fef4d2f76e38ece99cb99d836",
      "unit_id": "28254",
      "startdate": "10/03/2017",
      "enddate": "10/06/2017",
      "available_properties": {
        "property": {
          "unit_id": "28254",
          "unit_name": "Home",
          "location_id": "16268",
          "building_id": "16549",
          "building_name": "Default",
          "condo_type_id": "18715",
          "condo_type_name": "3 Bedroom Blue Creek Cabin",
          "first_day_price": "1568.00",
          "minimum_day_price": "1400.00",
          "price": "4200.00",
          "taxes": "3618.57",
          "fees": "3000.57",
          "total": "7818.57",
          "pricing_model_id": "1",
          "coupon_id": "0",
          "coupon_discount": "0.00",
          "reward_points_discount": null,
          "message": null,
          "location_comment": "Demo Home Update Info",
          "expected_charges": [
            {
              "charge_value": "36.00",
              "charge_date": "09/15/2017",
              "description": "Required Payment for Fee: Test Processing Fee (100.00%)",
              "type_id": "1",
              "ledger_id": null,
              "tax_id": null
            },
            {
              "charge_value": "100.00",
              "charge_date": "09/15/2017",
              "description": "Required Payment for Fee: !!!Test HA GROUP (100.00%)",
              "type_id": "1",
              "ledger_id": null,
              "tax_id": null
            },
            {
              "charge_value": "150.00",
              "charge_date": "09/15/2017",
              "description": "Required Payment for Fee: GROUPED FEE TEST (100.00%)",
              "type_id": "1",
              "ledger_id": null,
              "tax_id": null
            },
            {
              "charge_value": "510.00",
              "charge_date": "09/15/2017",
              "description": "Required Payment for Fee: Owner Upcharge (100.00%)",
              "type_id": "1",
              "ledger_id": null,
              "tax_id": null
            },
            {
              "charge_value": "463.50",
              "charge_date": "09/15/2017",
              "description": "Required Payment for Fee: State Tax (100.00%)",
              "type_id": "1",
              "ledger_id": null,
              "tax_id": null
            },
            {
              "charge_value": "500.00",
              "charge_date": "09/15/2017",
              "description": "Required Payment for Fee: Pet Fee (100.00%)",
              "type_id": "1",
              "ledger_id": null,
              "tax_id": null
            },
            {
              "charge_value": "219.38",
              "charge_date": "09/15/2017",
              "description": "Required Payment for Fee: Booking Fee (100.00%)",
              "type_id": "1",
              "ledger_id": null,
              "tax_id": null
            },
            {
              "charge_value": "360.50",
              "charge_date": "09/15/2017",
              "description": "Required Payment for Fee: Test State Tax (100.00%)",
              "type_id": "1",
              "ledger_id": null,
              "tax_id": null
            },
            {
              "charge_value": "257.50",
              "charge_date": "09/15/2017",
              "description": "Required Payment for Fee: Test State Tax !!! (100.00%)",
              "type_id": "1",
              "ledger_id": null,
              "tax_id": null
            },
            {
              "charge_value": "200.00",
              "charge_date": "09/15/2017",
              "description": "Required Payment for Fee: Test Cleaning Fee (100.00%)",
              "type_id": "1",
              "ledger_id": null,
              "tax_id": null
            },
            {
              "charge_value": "5021.69",
              "charge_date": "09/15/2017",
              "description": "Required Payment 100.00%",
              "type_id": "1",
              "ledger_id": null,
              "tax_id": null
            },
            {
              "charge_value": "500.00",
              "charge_date": "09/15/2017",
              "description": "Guest Security Deposit: 100.00%",
              "type_id": "2",
              "ledger_id": "26124",
              "tax_id": null
            }
          ],
          "restriction_message": null,
          "rating_average": "74.17"
        }
      }
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "GetPropertyAvailabilityWithRatesWordPress",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317",
        "startdate": "",
        "enddate": "",
        "view_name_filter": "Ocean Front/Ocean View",
        "view_id_filter": "9415,5959",
        "use_guest_deposits": 1,
        "bedrooms_number": 3,
        "min_bedrooms_number": 2,
        "max_bedrooms_number": 8
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": {
      "token_key": "cd7745ec2585802fb8542dd1dbb1dc32",
      "token_secret": "04dd76c93aad0e4fef4d2f76e38ece99cb99d836",
      "unit_id": "28254",
      "startdate": "10/03/2017",
      "enddate": "10/06/2017",
      "available_properties": {
        "property": {
          "id": "28254",
          "seo_page_name": "blue-creek-cabin",
          "rating_count": "6",
          "rating_average": "74.17",
          "flyer_url": null,
          "name": "Home",
          "location_name": "Blue Creek Cabin",
          "web_name": "Blue Creek Cabin",
          "short_description": "Used by XML/API sites. Not used for sites utilizing our WP plugin. test0",
          "view_name": "Pool View",
          "property_rating_name": null,
          "property_rating_points": null,
          "max_occupants": "12",
          "bedrooms_number": "5",
          "bathrooms_number": "5.5",
          "condo_type_name": "3 Bedroom Blue Creek Cabin",
          "condo_type_group_name": "3 Bedroom",
          "location_area_id": "2309",
          "location_area_name": "Huntington Beach",
          "neighborhood_area_id": "2337",
          "neighborhood_name": "La Jolla",
          "resort_area_id": "2807",
          "resort_area_name": "Resort A",
          "max_adults": "10",
          "max_pets": "0",
          "lodging_type_id": "3",
          "home_type": "Adobe",
          "latitude": null,
          "longitude": null,
          "location_latitude": "33.3502878",
          "location_longitude": "-111.9111680",
          "sale_enabled": "1",
          "state_id": "3",
          "state_name": "AZ",
          "city": "Tempe",
          "region": null,
          "community": null,
          "country_id": "227",
          "city_id": "1004",
          "community_id": null,
          "region_id": null,
          "continent_id": "6",
          "continent_name": "North America",
          "continent_description": null,
          "use_streamshare": "0",
          "first_day_price": "1568.00",
          "minimum_day_price": "1400.00",
          "price": "4200.00",
          "taxes": "3618.57",
          "fees": "3000.57",
          "total": "7818.57",
          "coupon_discount": "0.00",
          "pricing_model_id": "1",
          "location_comment": "Demo Home Update Info",
          "restriction_message": null,
          "default_thumbnail_path": "https://web.streamlinevrs.com/pmt_common/d_images/location_thumbnail_16268.jpeg",
          "default_image_path": "https://web.streamlinevrs.com/pmt_common/d_images/location_image_16268.jpeg",
          "unit_amenities": {
            "amenity": [
              {
                "group_name": "Changeover/Arrival Day",
                "group_description": null,
                "amenity_name": "Arrival Day Flexible",
                "amenity_description": null,
                "amenity_id": "184535",
                "amenity_show_on_website": "no"
              },
              {
                "group_name": "Suitability",
                "group_description": null,
                "amenity_name": "Children Ask",
                "amenity_description": null,
                "amenity_id": "184517",
                "amenity_show_on_website": "no"
              },
              {
                "group_name": "Suitability",
                "group_description": null,
                "amenity_name": "Children Welcome",
                "amenity_description": null,
                "amenity_id": "184516",
                "amenity_show_on_website": "no"
              },
              {
                "group_name": "Entertainment",
                "group_description": null,
                "amenity_name": "Television",
                "amenity_description": null,
                "amenity_id": "184265",
                "amenity_show_on_website": "no"
              },
              {
                "group_name": "Pool/Spa",
                "group_description": null,
                "amenity_name": "Indoor Pool",
                "amenity_description": null,
                "amenity_id": "188581",
                "amenity_show_on_website": "no"
              },
              {
                "group_name": "Pool/Spa",
                "group_description": null,
                "amenity_name": "Private Pool",
                "amenity_description": null,
                "amenity_id": "188582",
                "amenity_show_on_website": "no"
              },
              {
                "group_name": "Kitchen and Dining",
                "group_description": null,
                "amenity_name": "Microwave",
                "amenity_description": null,
                "amenity_id": "184314",
                "amenity_show_on_website": "no"
              },
              {
                "group_name": "Kitchen and Dining",
                "group_description": null,
                "amenity_name": "Coffee Maker",
                "amenity_description": null,
                "amenity_id": "184313",
                "amenity_show_on_website": "no"
              },
              {
                "group_name": "Kitchen and Dining",
                "group_description": null,
                "amenity_name": "Dishwasher",
                "amenity_description": null,
                "amenity_id": "184317",
                "amenity_show_on_website": "no"
              },
              {
                "group_name": "Amenities",
                "group_description": null,
                "amenity_name": "Internet",
                "amenity_description": null,
                "amenity_id": "184360",
                "amenity_show_on_website": "no"
              },
              {
                "group_name": "Amenities",
                "group_description": null,
                "amenity_name": "Air Conditioning",
                "amenity_description": null,
                "amenity_id": "184354",
                "amenity_show_on_website": "no"
              },
              {
                "group_name": "Amenities",
                "group_description": null,
                "amenity_name": "Heating",
                "amenity_description": null,
                "amenity_id": "184353",
                "amenity_show_on_website": "no"
              },
              {
                "group_name": "Amenities",
                "group_description": null,
                "amenity_name": "Washer",
                "amenity_description": null,
                "amenity_id": "184359",
                "amenity_show_on_website": "no"
              },
              {
                "group_name": "Outdoor",
                "group_description": null,
                "amenity_name": "Grill",
                "amenity_description": null,
                "amenity_id": "184366",
                "amenity_show_on_website": "no"
              },
              {
                "group_name": "Accommodations",
                "group_description": null,
                "amenity_name": "Accommodation Type Bed and Breakfast",
                "amenity_description": null,
                "amenity_id": "184387",
                "amenity_show_on_website": "no"
              },
              {
                "group_name": "Accommodations",
                "group_description": null,
                "amenity_name": "Other Services Chauffeur",
                "amenity_description": null,
                "amenity_id": "184379",
                "amenity_show_on_website": "no"
              },
              {
                "group_name": "Sports and Adventure",
                "group_description": null,
                "amenity_name": "Mountaineering",
                "amenity_description": null,
                "amenity_id": "184440",
                "amenity_show_on_website": "no"
              },
              {
                "group_name": "Sports and Adventure",
                "group_description": null,
                "amenity_name": "Scuba or Snorkeling",
                "amenity_description": null,
                "amenity_id": "184448",
                "amenity_show_on_website": "no"
              },
              {
                "group_name": "Themes",
                "group_description": null,
                "amenity_name": "Family",
                "amenity_description": null,
                "amenity_id": "184466",
                "amenity_show_on_website": "yes"
              },
              {
                "group_name": "Themes",
                "group_description": null,
                "amenity_name": "Adventure",
                "amenity_description": null,
                "amenity_id": "184462",
                "amenity_show_on_website": "yes"
              },
              {
                "group_name": "Car",
                "group_description": null,
                "amenity_name": "Recommended",
                "amenity_description": null,
                "amenity_id": "184467",
                "amenity_show_on_website": "no"
              },
              {
                "group_name": "Location Types",
                "group_description": null,
                "amenity_name": "Ocean View",
                "amenity_description": null,
                "amenity_id": "184280",
                "amenity_show_on_website": "no"
              },
              {
                "group_name": "Attractions",
                "group_description": null,
                "amenity_name": "Ruins",
                "amenity_description": null,
                "amenity_id": "184474",
                "amenity_show_on_website": "no"
              },
              {
                "group_name": "Leisure",
                "group_description": null,
                "amenity_name": "Whale Watching",
                "amenity_description": null,
                "amenity_id": "184238",
                "amenity_show_on_website": "no"
              },
              {
                "group_name": "Local Features",
                "group_description": null,
                "amenity_name": "Laundromat",
                "amenity_description": null,
                "amenity_id": "184526",
                "amenity_show_on_website": "no"
              }
            ]
          }
        }
      }
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "GetPropertyAvailabilityWithTurnDates",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317",
        "startdate": "",
        "enddate": "",
        "occupants": ""
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": {
      "token_key": "cd7745ec2585802fb8542dd1dbb1dc32",
      "token_secret": "04dd76c93aad0e4fef4d2f76e38ece99cb99d836",
      "startdate": "10/08/2017",
      "enddate": "10/12/2017",
      "occupants": "2",
      "available_properties": {
        "property_id": [
          "28255",
          "45280",
          "28254",
          "34945",
          "32880",
          "37910",
          "28258",
          "209020",
          "226273",
          "34898",
          "221000",
          "83998",
          "28248",
          "69598",
          "248466",
          "82715",
          "28251",
          "28256",
          "31897",
          "31923",
          "45688",
          "65030",
          "82713",
          "82714",
          "28250",
          "42185",
          "28257",
          "41369",
          "45174",
          "69671",
          "278149",
          "200131",
          "232706",
          "200132",
          "226278",
          "277620",
          "248456",
          "28253",
          "226563",
          "98599",
          "241638",
          "28259"
        ]
      }
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "VerifyPropertyAvailability",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317",
        "unit_id": "",
        "startdate": "",
        "enddate": ""
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": {
      "id": "385256",
      "message": null
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "GetOwnerInfo",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317",
        "owner_id": 104370
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": {
      "id": "104370",
      "first_name": "King",
      "last_name": "Arthur III",
      "company": null,
      "login": "karthur",
      "email": "test@streamlinevrs.com",
      "address1": "35 supreme lane",
      "address2": null,
      "city": null,
      "zip": null,
      "state_name": null,
      "country_name": "US",
      "home_phone": null,
      "business_phone": null,
      "business_fax": null,
      "mobile_phone": null,
      "payment_tax_id": "656565825",
      "make_check_payable": "King Arthur",
      "entity_code": null,
      "units": {
        "unit": [
          {
            "id": "34945",
            "name": "Cactus Forest Cottage",
            "location_name": "Cactus Forest Cottage",
            "max_adults": "12",
            "lodging_type_id": "3"
          },
          {
            "id": "232274",
            "name": "kljhlkjhljhlkj",
            "location_name": "kljhlkjhljhlkj",
            "max_adults": "2",
            "lodging_type_id": "3"
          },
          {
            "id": "200132",
            "name": "Studio Unit 2",
            "location_name": "Las Palomas",
            "max_adults": "2",
            "lodging_type_id": "1"
          },
          {
            "id": "200131",
            "name": "Ocean Princess",
            "location_name": "Las Palomas",
            "max_adults": "2",
            "lodging_type_id": "1"
          },
          {
            "id": "146488",
            "name": "concorda",
            "location_name": "concorda",
            "max_adults": "2",
            "lodging_type_id": "3"
          },
          {
            "id": "127032",
            "name": "North Carolina's Beauty",
            "location_name": "North Carolina's Beauty",
            "max_adults": "6",
            "lodging_type_id": "3"
          },
          {
            "id": "68152",
            "name": "Haley's Home",
            "location_name": "Haley's Home",
            "max_adults": "4",
            "lodging_type_id": "3",
            "other_owners": {
              "owner_id": "102766"
            }
          },
          {
            "id": "93600",
            "name": "East Coast Garden",
            "location_name": "East Coast Garden",
            "max_adults": "6",
            "lodging_type_id": "3"
          },
          {
            "id": "83880",
            "name": "Test home",
            "location_name": "Test home",
            "max_adults": "2",
            "lodging_type_id": "3"
          },
          {
            "id": "82715",
            "name": "Child 2",
            "location_name": "Child 2",
            "max_adults": "4",
            "lodging_type_id": "3"
          },
          {
            "id": "82714",
            "name": "Child 1",
            "location_name": "Child 1",
            "max_adults": "5",
            "lodging_type_id": "3"
          },
          {
            "id": "82713",
            "name": "Master Home",
            "location_name": "Master Home",
            "max_adults": "4",
            "lodging_type_id": "3"
          },
          {
            "id": "42185",
            "name": "Casa Fire",
            "location_name": "Casa Fire",
            "max_adults": "4",
            "lodging_type_id": "3"
          },
          {
            "id": "37910",
            "name": "Willie's Home2",
            "location_name": "Willie's Home2",
            "max_adults": "2",
            "lodging_type_id": "3"
          }
        ]
      }
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "GetOwnerList",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317",
        "show_address_fields": 1,
        "owner_id": 517129,
        "first_name": "first name",
        "last_name": "last name",
        "email": "email@streamlinevrs.com",
        "phone": "555-555-5555",
        "address1": "123 5th st",
        "address2": "#47",
        "zip": 85286,
        "city": "Chandler",
        "state": "AZ",
        "country": "US",
        "agreement_startdate": "01/01/2017",
        "agreement_enddate": "01/31/2028",
        "notes": "notes example",
        "property": {
            "property_name": "Branson Mansion",
            "ownership_percentage": 100
        }
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": {
      "owner": [
        {
          "owner_id": "104370",
          "first_name": "King",
          "last_name": "Arthur III",
          "email": "test@streamlinevrs.com",
          "phone": null,
          "property": [
            {
              "property_name": "Las Palomas Studio Unit 2"
            },
            {
              "property_name": "Las Palomas Ocean Princess"
            },
            {
              "property_name": "Cactus Forest Cottage"
            },
            {
              "property_name": "kljhlkjhljhlkj"
            },
            {
              "property_name": "concorda"
            },
            {
              "property_name": "North Carolina's Beauty"
            },
            {
              "property_name": "Haley's Home"
            },
            {
              "property_name": "East Coast Garden"
            },
            {
              "property_name": "Test home"
            },
            {
              "property_name": "Child 2"
            },
            {
              "property_name": "Child 1"
            },
            {
              "property_name": "Master Home"
            },
            {
              "property_name": "Casa Fire"
            },
            {
              "property_name": "Willie's Home2"
            }
          ]
        },
        {
          "owner_id": "121208",
          "first_name": "asdfasdf",
          "last_name": "asdfasdf",
          "email": "eve@4vrs.com",
          "phone": null
        },
        {
          "owner_id": "201905",
          "first_name": "Straw",
          "last_name": "Berry",
          "email": "straw@berry.com",
          "phone": null,
          "property": [
            {
              "property_name": "Las Palomas testing deactive"
            },
            {
              "property_name": "bobs house"
            },
            {
              "property_name": "Malibu"
            }
          ]
        },
        {
          "owner_id": "32094",
          "first_name": "Johnny",
          "last_name": "Cash",
          "email": "justin@streamlinevrs.com",
          "phone": "555-555-5555",
          "property": [
            {
              "property_name": "sdfasdfasdf"
            },
            {
              "property_name": "Wildcat Cabin"
            },
            {
              "property_name": "Love Shack"
            },
            {
              "property_name": "Coastal Relaxation"
            },
            {
              "property_name": "Vacation House"
            },
            {
              "property_name": "Vacation Home"
            },
            {
              "property_name": "Sunshine Penthouse"
            },
            {
              "property_name": "Leigh's Villas"
            },
            {
              "property_name": "Greatest 3 Bedroom Ever"
            },
            {
              "property_name": "TEST BPAL HOME"
            },
            {
              "property_name": "SuperDuperHome"
            },
            {
              "property_name": "SuperHome"
            },
            {
              "property_name": "Greatest Home Ever"
            },
            {
              "property_name": "Jasons Home"
            },
            {
              "property_name": "Home"
            },
            {
              "property_name": "Eutopia"
            }
          ]
        },
        {
          "owner_id": "101489",
          "first_name": "jessica",
          "last_name": "Collins",
          "email": null,
          "phone": null,
          "property": [
            {
              "property_name": "asdfasdfas"
            },
            {
              "property_name": "Blue Creek Cabin-Collins-03-08-2017"
            },
            {
              "property_name": "Sunset Villa"
            }
          ]
        },
        {
          "owner_id": "110399",
          "first_name": "R2",
          "last_name": "D2",
          "email": null,
          "phone": null,
          "property": [
            {
              "property_name": "asdfasfsa"
            },
            {
              "property_name": "casa de la playa"
            },
            {
              "property_name": "Test Seasons"
            }
          ]
        },
        {
          "owner_id": "228546",
          "first_name": "Rob",
          "last_name": "Demo",
          "email": null,
          "phone": null,
          "property": [
            {
              "property_name": "Cool Water Condo"
            },
            {
              "property_name": "Rob Resort"
            }
          ]
        },
        {
          "owner_id": "260692",
          "first_name": "Gustavo",
          "last_name": "Enrique",
          "email": "gustavo@gustavo.com",
          "phone": null
        },
        {
          "owner_id": "101887",
          "first_name": "Nick",
          "last_name": "Faldo",
          "email": "vandiver@streamlinevrs.com",
          "phone": null,
          "property": {
            "property_name": "Sweet Pete's Retreat"
          }
        },
        {
          "owner_id": "32095",
          "first_name": "Roger",
          "last_name": "Federer",
          "email": "vandiver@streamlinevrs.com",
          "phone": "555-555-5555",
          "property": [
            {
              "property_name": "Greatest Home Everer"
            },
            {
              "property_name": "Tommy's Bahama"
            },
            {
              "property_name": "Desert Oasis \"Adobe\""
            },
            {
              "property_name": "Nirvana"
            },
            {
              "property_name": "Family Getaway"
            },
            {
              "property_name": "Skyview"
            }
          ]
        },
        {
          "owner_id": "32097",
          "first_name": "Tina",
          "last_name": "Fey",
          "email": "test@4vrs.com",
          "phone": "555-555-5555",
          "property": [
            {
              "property_name": "The Summit"
            },
            {
              "property_name": "Studio 54"
            },
            {
              "property_name": "Cool Water Condo"
            },
            {
              "property_name": "The Love Shack"
            },
            {
              "property_name": "The Aloha"
            },
            {
              "property_name": "Coastal Relaxation"
            },
            {
              "property_name": "Sunshine Penthouse"
            },
            {
              "property_name": "Jim's Private Paradise"
            },
            {
              "property_name": "Gentle Paradise"
            }
          ]
        },
        {
          "owner_id": "266028",
          "first_name": "Godric",
          "last_name": "Green",
          "email": "eve@4vrs.com",
          "phone": null,
          "property": [
            {
              "property_name": "Summit Cove Test"
            },
            {
              "property_name": "Crystal Tower"
            }
          ]
        },
        {
          "owner_id": "141799",
          "first_name": "Ndhdhdj",
          "last_name": "Hdhhd",
          "email": "test76774@test.com",
          "phone": null,
          "property": {
            "property_name": "Blue Creek Cabin"
          }
        },
        {
          "owner_id": "32096",
          "first_name": "Hugh",
          "last_name": "Jackman",
          "email": "vandiver@streamlinevrs.com",
          "phone": "555-555-5555",
          "property": [
            {
              "property_name": "Desert Oasis \"Adobe\""
            },
            {
              "property_name": "Serenity"
            },
            {
              "property_name": "Dream House"
            }
          ]
        },
        {
          "owner_id": "121376",
          "first_name": "Michael",
          "last_name": "Jordan",
          "email": "jessica@streamlinevrs.com",
          "phone": "232-323-2323",
          "property": [
            {
              "property_name": "Boom"
            },
            {
              "property_name": "New Home Test"
            },
            {
              "property_name": "Jordan's Bull House"
            }
          ]
        },
        {
          "owner_id": "171152",
          "first_name": "Christine",
          "last_name": "Mahon",
          "email": null,
          "phone": null,
          "property": {
            "property_name": "Chasing Your Dream"
          }
        },
        {
          "owner_id": "113891",
          "first_name": "Luis",
          "last_name": "Morfin",
          "email": "luis@morfin.com",
          "phone": null
        },
        {
          "owner_id": "143502",
          "first_name": "Rhonda",
          "last_name": "Morgan",
          "email": "rhonda@streamlinevrs.com",
          "phone": null,
          "property": [
            {
              "property_name": "Copy Test 2"
            },
            {
              "property_name": "Copy Test"
            }
          ]
        },
        {
          "owner_id": "190673",
          "first_name": "Mister",
          "last_name": "Owner",
          "email": "owner@user.com",
          "phone": null
        },
        {
          "owner_id": "105511",
          "first_name": "Test",
          "last_name": "Owner",
          "email": null,
          "phone": null
        },
        {
          "owner_id": "270882",
          "first_name": "OwnerFirst",
          "last_name": "OwnerLast",
          "email": "test-owner@test.com",
          "phone": "444 444-4444",
          "property": [
            {
              "property_name": "Test Room Name"
            },
            {
              "property_name": "Import Property Name"
            },
            {
              "property_name": "Test Import Home"
            }
          ]
        },
        {
          "owner_id": "270883",
          "first_name": "OwnerFirst2",
          "last_name": "OwnerLast2",
          "email": "test-owner2@test.com",
          "phone": "444 444-4444",
          "property": [
            {
              "property_name": "Test Room Name"
            },
            {
              "property_name": "Import Property Name"
            },
            {
              "property_name": "Test Import Home"
            }
          ]
        },
        {
          "owner_id": "32098",
          "first_name": "Danica",
          "last_name": "Patrick",
          "email": "justin@streamlinevrs.com",
          "phone": "555-555-5555",
          "property": [
            {
              "property_name": "Fernandez The Bull"
            },
            {
              "property_name": "Nirvana"
            },
            {
              "property_name": "Lavish Lounge"
            }
          ]
        },
        {
          "owner_id": "121207",
          "first_name": "pasto",
          "last_name": "pista",
          "email": "streamline@pasta.com",
          "phone": "13345",
          "property": {
            "property_name": "Costa vista"
          }
        },
        {
          "owner_id": "102801",
          "first_name": "George",
          "last_name": "Riva",
          "email": null,
          "phone": null
        },
        {
          "owner_id": "260693",
          "first_name": "Roman",
          "last_name": "Roman",
          "email": "roman@roman.com",
          "phone": null,
          "property": {
            "property_name": "Romans Paradise On The Beach"
          }
        },
        {
          "owner_id": "280683",
          "first_name": "Rick",
          "last_name": "Sanchez",
          "email": null,
          "phone": null,
          "property": {
            "property_name": "Inntopia Feed Home"
          }
        },
        {
          "owner_id": "201904",
          "first_name": "Tom",
          "last_name": "Smith",
          "email": "smith1234@email.com",
          "phone": null
        },
        {
          "owner_id": "102766",
          "first_name": "Rob",
          "last_name": "Stark",
          "email": "rob@thronesofgames.com",
          "phone": null,
          "property": [
            {
              "property_name": "Haley's Home"
            },
            {
              "property_name": "Unit 1B"
            },
            {
              "property_name": "Unit 1AB"
            }
          ]
        },
        {
          "owner_id": "32099",
          "first_name": "Taylor",
          "last_name": "Swift",
          "email": "tswift@swifty.com",
          "phone": "555-555-5555",
          "property": [
            {
              "property_name": "Desert Oasis \"Adobe\""
            },
            {
              "property_name": "Modern Mansion 2"
            },
            {
              "property_name": "Sleeping Bear"
            },
            {
              "property_name": "Modern Mansion"
            },
            {
              "property_name": "Woodside Manor"
            }
          ]
        },
        {
          "owner_id": "122867",
          "first_name": "lee",
          "last_name": "test",
          "email": "lee@testemail.com",
          "phone": null
        },
        {
          "owner_id": "105308",
          "first_name": "Test",
          "last_name": "Test",
          "email": null,
          "phone": null,
          "property": [
            {
              "property_name": "test test"
            },
            {
              "property_name": "Island Sands"
            }
          ]
        },
        {
          "owner_id": "124422",
          "first_name": "test",
          "last_name": "test",
          "email": "seth@streamlinevrs.com",
          "phone": null
        },
        {
          "owner_id": "285095",
          "first_name": "Test",
          "last_name": "Tester",
          "email": "eve@4vrs.com",
          "phone": null,
          "property": {
            "property_name": "A Bit Stormy Stormy Clouds"
          }
        },
        {
          "owner_id": "187023",
          "first_name": "Corp",
          "last_name": "Testing",
          "email": "corp@streamlinevrs.com",
          "phone": null,
          "property": [
            {
              "property_name": "Bills Cabin"
            },
            {
              "property_name": "Tamarack Idaho Conference Room 1"
            }
          ]
        },
        {
          "owner_id": "122533",
          "first_name": "Zeus",
          "last_name": "Thunderstriker",
          "email": "zeus@streamline.com",
          "phone": null,
          "property": [
            {
              "property_name": "123 EZ"
            },
            {
              "property_name": "Shady Park Resort Unit 294628910374739202"
            }
          ]
        },
        {
          "owner_id": "190677",
          "first_name": "Owner",
          "last_name": "User",
          "email": "test@test.com",
          "phone": null,
          "property": {
            "property_name": "Best Home Name Ever"
          }
        },
        {
          "owner_id": "146447",
          "first_name": "Jason",
          "last_name": "Voorhees",
          "email": null,
          "phone": null
        },
        {
          "owner_id": "113889",
          "first_name": "little",
          "last_name": "wayne",
          "email": "littlewayne@gmail.com",
          "phone": null
        }
      ]
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "GetAllFeedback",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317",
        "feedback_random": "yes",
        "feedback_limit": 10,
        "all_units": 1,
        "return_all": 1,
        "unit_id": 245632,
        "startdate": "2023-06-01",
        "enddate": "2023-07-01",
        "show_booking_dates": 1
    }
}
            
```

**Response**

```jsx

              
{
  "Response": {
    "data": {
      "comments": {
        "id": "23007",
        "unit_id": "28254",
        "status_id": "2",
        "rating_id": "814",
        "client_id": "2103629",
        "company_id": "348",
        "location_id": "16268",
        "creation_date": "12/16/2015 00:00:00",
        "email": null,
        "first_name": "David Robbins",
        "last_name": null,
        "title": "Private and Very Comfortable",
        "comments": "This home was exactly what was advertised. It would be very comfortable for 3 couples each having there own bedroom and bath including large showers. The outside living had a nice pool and BBQ area if you enjoy cooking your own meals. It is very private and quiet hearing no street noise at all, you feel that you are living in the country. This is a perfect vacation rental for anyone looking for a place to relax. You need to be aware that the cell reception was not the best.",
        "admin_comments": null,
        "reservation_id": null,
        "show_in_owner_area": "0",
        "show_in_site": "1",
        "madetype_id": "3",
        "creation_date_system": "12/18/2015 02:01:48",
        "survey_result_id": null,
        "name": "Home",
        "seo_page_name": "blue-creek-cabin",
        "location_name": "Blue Creek Cabin",
        "points": "80",
        "madetype_name": "Imported vrbo.com",
        "review_as_image": "http://www.resortpro.net/pmt_common/d_images/review_23007.png"
      }
    }
  }
}
            
```

---

*Playload*

```jsx

              
{
    "methodName": "GetAllowedCardTypes",
    "params": {
        "token_key": "d5f834dbfb09d743b601e2ae534cc2a4",
        "token_secret": "d9d72cddfc270e112f7cf208f142af982bcc7317"
    }
}
            
```

**Response**

```jsx

              
{
  "root": {
    "data": [
      {
        "id": "1",
        "name": "Visa"
      },
      {
        "id": "2",
        "name": "MasterCard"
      },
      {
        "id": "3",
        "name": "AmericanExpress"
      },
      {
        "id": "4",
        "name": "Discover"
      }
    ]
  }
}
            
```

---