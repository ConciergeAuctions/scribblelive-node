function post(json_from_api)
{
	if(json_from_api.Id)
	{
		console.log(json_from_ap)
		this.id = json_from_api.Id;
		this.content = json_from_api.Content;
		this.creator = {
			id: json_from_api.Creator.Id,
			name: json_from_api.Creator.Name,
			avatar: json_from_api.Creator.Avatar
		};
		this.is = {
			comment: ( json_from_api.IsComment === 1 ),
			deleted: ( json_from_api.IsDeleted === 1 ),
			stuck: ( json_from_api.IsStuck === 1 ),
			approved: ( json_from_api.IsApproved === 1 ),
		},
		this.source = json_from_api.Source;
		this.type = json_from_api.Type;
		this.media = json_from_api.Media || null;
		this.postmeta = json_from_api.PostMeta || null;
		if (this.postmeta && typeof this.postmeta.Images === 'string') {
			this.postmeta.Images = JSON.parse(this.postmeta.Images);
			this.postmeta.Images.sort(function(a, b) {
				if (a.width > b.width) return -1;
				if (a.width < b.width) return 1;
				return 0;
			});
		}
		this.date = {
			created: post.convert_date(json_from_api.Created),
			modified: post.convert_date(json_from_api.LastModified)
		};
	}
}

post.convert_date = function(api_date)
{
	return new Date(parseInt(api_date.match(/\d+/)[0]));
};

post.convert = function(json)
{
	if(typeof json == "object" && json.length)
	{
		// it's an array
		return json.map(function(p)
		{
			return new post(p);
		});
	}
	else if(typeof json == "object")
	{
		// it's an individual post
		return new post(json);
	}
	else
	{
		return null;
	}
};

post.convert_to_api = function(json)
{
	if(json.content)
	{
		return {
			Content: json.content,
			Creator: (json.creator ? json.creator.name : undefined )
		};
	}
	else if(json.Content)
	{
		return json;
	}
	else
	{
		throw new Error("Invalid format");
	}

};

module.exports = post;
