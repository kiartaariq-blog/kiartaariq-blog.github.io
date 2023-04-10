---
title:  How to Replicate Bloomberg's Interest Rates Curves with Quantlib
author: Kiar Fatah
layout: blog
createdAt:  TBA
description: "How to Replicate Bloomberg's Interest Rates Curves"
tags: [Bootstrapping, Interest Rates Curves, Quantlib, Deposit, Swaps]
toc: true
---
## Introduction
<p style="text-align: justify"> 
The processes of deriving a yield curve has many names in the finance industry, it can be called for example: finding the redemption curve, constructing the term structure of interest rates, stripping and etc. In this blog post we will go through the process of constructing the yield curve for the Bloomberg SEK (vs. 6M STIBOR), also known as 348, with the help of the Python package QuantLib. When reading this tutorial consider that the main goal is to learn how to bootstrap interest rate curves with Quantlib and that Bloomberg's curve will be our answer key to make sure that everything is correct regarding dates, day count and calendar conventions. Moreover, it is assumed that the reader is familiar with instruments such as deposits and swaps - why else would you end up here.

The packages that are needed for this tutorial are:
- QuantLib
- Numpy
## SEK (vs. 6M STIBOR)
<p style ="text-align: justify">
As seen in Figure 1, the SEK (vs. 6M STIBOR) is a swap curve based on the 6 month Stockholm Interbank Offered Rate, which denotes the 6M STIBOR. The cash rate for the 6M STIBOR can be viewed on the left hand side of Figure 1 and on the right handside of Figure 1 the rates for the swaps. From respective panels of the instruments the daycount convention can also be seen in the bottom. The usage of SEK (vs. 6M STIBOR) is to forecast the interest rate for the 6M STIBOR. Thus meaning, that whatever point we select on the curve is what the market will assume the 6M STIBOR will be in that amount of time. As a result this will forecast the floating leg of a swap.
</p>

![image alt text](media/quotes.png)
|:--:| 
| Figure 1: Quotes for SEK (vs. 6M STIBOR) from Curve Construction in the Bloomberg Terminal. |

## Quantlib
<p style ="text-align: justify">
We initiate with setting the desired date and importing the required packages. The date is set with reference to the top right corner of Figure 1. Note, this is a very important step of the bootstrapping procedure as it will ensure us that the maturity dates of the curve will be correct:
</p>

```python
# Import the necessary packages 

import numpy as np
import quantlib as ql
from datetime import datetime, date, timedelta

# Define the date according the QuantLib standards
ql_date = ql.Date("2023-01-09", "%Y-%m-%d") 
ql.Settings.instance().evaluationDate = ql_date
```

<p style="text-align: justify"> 
Furthermore, the main approach behind bootstrapping with QuantLib is to define all your instruments with the help of helpers. Helpers are functions designed to define an instrument with their properties to make the bootstrapping procedure less painful. There are helpers for each instrument such as: 

- DepositRateHelper
- FraRateHelper
- FuturesRateHelper

and so on, you can find the list of all helpers [here](https://quantlib-python-docs.readthedocs.io/en/latest/thelpers.html). When you have defined the instruments with helpers you want to store them in a list so that you can call ql.PiecewiseLinearZero() which will find the solutions for the curve given the instruments you have defined.
</p>


<p style ="text-align: justify">
As the first instrument in curve is the 6M STIBOR it will be the first instrument to be modelled. 6M STIBOR is interpreted as a deposit rate. Thus, we use the QuantLib function DepositRateHelper:
</p>

```python
# Create an empty array to store all the helpers as previously mentioned.
store_helpers = []

# Define all the properties of the instrument
stibor_rate = 3.21800 
stibor_maturity= '6M'
stibor_calendar = ql.TARGET()
stibor_fixing_day = 0
stibor_convention = ql.ModifiedFollowing
stibor_day_counter= ql.Actual360()

# Create the DepositRateHelper
stibor_helper = ql.DepositRateHelper(ql.QuoteHandle(ql.SimpleQuote(stibor_rate/100.0)), 
                    ql.Period(stibor_maturity), 
                    stibor_fixing_day,
                    stibor_calendar, 
                    stibor_convention,
                    stibor_day_counter) 
# Store the DepositRateHelper to the list of helpers
store_helpers.append(stibor_helper)
```
<p style = "text-align: justify">

### store_helpers
store_helpers is initially an empty list which will be used to store all the helper objects.

### stibor_rate
stibor_rate stores the rate of the deposit which can be observed on the left side of Figure 1. Note that the value given in the Bloomberg Terminal is the interest rate of 6M STIBOR given in procentage. Therefore, as observed in the code, the stibor_rate variable is divided by 100.00 to obtain the true interest rate. 

### stibor_maturity
As mentioned previously, 6M STIBOR is the 6 month average short end interest rate loan that Swedish bank charging each other when loaning without collateral. Therefore, the maturity of the deposit is set to 6 months.

### stibor_calendar
Next up is the calendar, in this case TARGET is applied. TARGET stands for Trans-European Automated Real-time Gross settlement Express Transfer, which is a standarized calendar for financial instruments, selecting the correct calendar is important as they contain the days of which there is a holiday. Holidays are essential to consider as they are a variable to the final maturity date of the instrument.  Note, we have the choice to use ql.SWEDEN() - or make a custom calendar - if we feel that TARGET is missing out on a bank holiday specifically for Sweden. It is up to you to decide what calendar is fit for you. 

### stibor_fixing_day TBA
Fixing days in finance refer to specific dates when the interest rate or other terms of a financial instrument are established or adjusted. In the context of a deposit, fixing days are the dates on which the interest rate for the deposit is set. 

### stibor_convention
Afterwards, the convention for date rolling is set to Modified Following. Date rolling refers to the adjustment of the maturity date given if a business date of our instrument falls on a holiday, as the market is closed on holidays. The maturity date will then typically be shifted to a business day. This will result in the maturity date often having a few extra days before it matures.

### stibor_day_counter
In finance, the day counter of an instrument is used to calculate the exact amount of interest due at a specific point in time. Different day counters use different methods to count the number of days between two dates, and the choice of day counter can have a significant impact on the calculated interest amount. In this setup we can find the day counter of the instrument in the bottom of the rates of Figure 1 as previously mentioned.

---

The next step is to define the swaps. If you search for these swaps on the Bloomberg Terminal it will show that these swaps has a floating leg with underlying based on 6M STIBOR. Unfortunately, the Swedish 6M STIBOR is not a standard index in the Python version of Quantlib as far as I know. Therefore we need to define a custom one which is simply done as follow:
</p>

```python
# The underlying floating rate
stibor_6m = ql.IborIndex('STIBOR6M', # Name
                         ql.Period('6M'), # Maturity
                         0, # Fixing day
                         ql.SEKCurrency(),  # Currency
                         ql.TARGET(), # Calendar
                         ql.ModifiedFollowing,  # Calendar convention
                         ql.Actual360()) # Day count
```

<p style = "text-align: justify">
Moreover, the swap rates in Figure 1 are given as ask and bid. The bootstrap procedure is based on the mid price, which is based on the average of the bid and ask:
</p>


```python
# Calculate the mid price 
bid_list= [3.51270, 3.45697, 3.29768, 3.18463, 3.10489, 3.06276, 3.03423,
3.00924, 2.99359, 2.97369, 2.94015, 2.87215, 2.76782, 2.54788]


ask_list = [3.53271, 3.48944, 3.33052, 3.21477, 3.13611, 3.09204, 3.06377,
3.03876, 3.01821, 3.00251, 2.96605, 2.90305, 2.79838, 2.57832]
mid = [(bid + ask)/2 for bid, ask in zip(bid_list,ask_list)]
```

<p style = "text-align: justify">
Then continuing with SwapRateHelper: 
</p>

```python
fixedFrequency = ql.Annual
fixedConvention = ql.ModifiedFollowing
fixedDayCount = ql.Thirty360(ql.Thirty360.BondBasis)
calendar = ql.TARGET()

tenor =['1Y', '2Y', '3Y', '4Y', 
        '5Y', '6Y', '7Y', '8Y', 
        '9Y', '10Y', '12Y','15Y',
        '20Y', '30Y']
iborIndex = index
for r,m in zip(mid, tenor):
    rate = ql.QuoteHandle(ql.SimpleQuote(r/100.0))
    tenor = ql.Period(m)
    swap_helper = ql.SwapRateHelper(rate, tenor, calendar,
     fixedFrequency, fixedConvention, fixedDayCount, stibor_6m)
    
    # Append each swap to our store_helpers
    store_helpers.append(swap_helper)
```

<p style = text-align: justify>
Now that all instruments are defined we can execute the bootstrapping algorithm by using the following:
</p>

```python
curve = ql.PiecewiseLinearZero(0, ql.TARGET(), helpers, ql.Actual365Fixed())
```

Note that you also have the option here to change the calendar and the day count for the bootstrap itself. You will have the option to modify these parameters based on your desired outcome.

## Result
The resulting curve from Bloomberg can be observed in Figure 2. In Figure 3 it is possible to view the curve that we have managed to create.

![image alt text](media/curve.png)
|:--:| 
| Figure 1: The Bloomberg curve SEK (vs. 6M STIBOR) from Curve Construction in the Bloomberg Terminal. |

To make it easier to compare a table is created of which the difference between the results are calculated as viewed in Table 1.


## Conclusion
In this blog post we have managed to recreate the SEK (vs. 6M STIBOR) from curve construction from the Bloomberg Terminal using QuantLib. In the next post for bootstrapping we will have a look how to manually bootstrap.