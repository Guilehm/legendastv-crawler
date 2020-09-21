# LegendasTv Crawler

## Required
* Docker
* Docker Compose

## Installation


Clone this repository

    git clone git@github.com:Guilehm/legendastv-crawler.git

Enter the repository

    cd legendastv-crawler

Copy `env.sample` to `.env`

    cp env.sample .env

Then edit it and set your `USERNAME` and `PASSWORD`

    vim .env

Build and start the app

    make run

*If you have Mongodb running local, you must stop it first: `sudo systemctl stop mongodb`.*


## Use guide

The crawler will search for `Os Simpsons` find all the titles and then start crawling each title page to get the subtitles from them.

At this point, the crawler will have created documents in Mongodb for subtitles in this format:

```json
{
    "_id" : "5f68e2895c136ee4c30ebd09",
    "crawled" : false,
    "name" : "The.Simpsons.S09E05.Dvdrip.Xvid-Topaz",
    "grade" : 10,
    "url" : "http://legendas.tv/download/3883aa46f7d0da93d52eaa2ca12abdd0/The_Simpsons/The_Simpsons_S09E05_Dvdrip_Xvid_Topaz",
    "dateAdded" : "2020-09-21T23:27:37.226Z",
}
```

The flag `crawled = false` means that this subtitle data is still incomplete. The crawler will scrape the detail page for this subtitle and populate it with all its data later.

After the crawler scrape the subtitle detail page, the subttitles format will be like this:

```json
{
    "_id" : "5f68e2895c136ee7310ebd04",
    "crawled" : true,
    "name" : "(p)The.Simpsons.S09.DVDRip.XviD-TOPAZ [SubRip]",
    "grade" : 10,
    "url" : "http://legendas.tv/download/5290e84188ed769aa5bd70ef7a84bb4a/The_Simpsons/p_The_Simpsons_S09_DVDRip_XviD_TOPAZ_SubRip",
    "dateAdded" : "2020-09-21T17:27:37.217Z",
    "downloadUrl" : "http://legendas.tv/downloadarquivo/5290e84188ed769aa5bd70ef7a84bb4a",
    "language" : "Português-BR",
    "sendDate" : "2012-01-26T00:00:00.000Z",
    "sender" : "caio.matrix",
    "likeRatio" : 100,
    "downloadCount" : 1267
}
```


All codes to extract the data are executed in sequence. So it is only necessary to run `make run` command for the crawler to start and do all the work.


## Containers

Start the crawler

    make run


Stopping containers

    make stop


Remove containers and database volume

    make down


If you need to build and run the app again

    make build
