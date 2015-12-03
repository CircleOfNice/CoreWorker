/*
 * This file is part of CoreWorker.
 *
 * CoreWorker is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * CoreWorker is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with CoreWorker.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Copyright 2015 TeeAge-Beatz UG (haftungsbeschränkt)
 */

import { Singleton } from "@circle/core-meta";

@Singleton
class Increment {
    constructor() {
        this.counter  = 0;
        this.interval = setInterval(::this.increase, 1);
    }

    increase() {
        this.counter = this.counter + 1;

        console.log(`Log No. ${this.counter}`);
        return this.counter > 39 ? clearInterval(this.interval) : null;
    }
}

Increment();
