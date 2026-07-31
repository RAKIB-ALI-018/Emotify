Token blacklisting hum mongoDB mein implememnt nahi karte....wo toh bss ek method 
hai jisme hum ek collection banate hai aur jitne bhi token blacklist karne hai 
wo uss collection mein hum daalte jaynge.

but actual method blacklisting ka REDIS ki help se hota hai(reason: throughput jyada hota hai)


Q: throughtput??
Ans: Throughput is the amount of work, data, or items that a system can process or produce in a given amount of time.


* MongoDB: High throughput for persistent database operations (typically tens of thousands to hundreds of thousands of ops/sec).
* Redis: Extremely high throughput because it stores data in RAM (typically hundreds of thousands to millions of ops/sec).






Q: why not we use redis as primary database?
* Limited data types – Optimized for key-value data, not complex relational data.
* Data persistence is optional – Primarily designed as an in-memory database; data can be lost if not configured properly.
* High memory cost – Storing all data in RAM is much more expensive than disk storage.
* Limited querying – Does not support rich SQL-like queries, joins, or complex filtering.
* Weak relationship handling – No native support for foreign keys or complex relationships.
* Scalability challenges for large datasets – Very large datasets may not fit into memory.
* Less suitable for analytics – Not designed for heavy reporting or analytical queries.
* Best as a cache – Excels at caching and fast lookups, not as the primary database for most applications.