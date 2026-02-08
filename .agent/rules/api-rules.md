---
trigger: always_on
---

*Payload*

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

*Payload*

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

*Payload*

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

*Payload*

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

*Payload*

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

*Payload*

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

*Payload*

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
        "cross