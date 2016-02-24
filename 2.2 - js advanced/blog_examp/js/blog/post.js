var App = App || {};

App.blog = App.blog || {};

App.blog.Post = (function () {
	var Post = function (content, comments) {
		this.content = content;

		this.comments = comments;

		this.element = document.createElement('div');

		this.id = content.id;

		this.createHeader();

		this.createBody();

		this.initListeners();

		this.renderContent();

		this.addComments();

		this.newComentBlock();

	}

	Post.prototype.createBody = function () {		
		this.body = document.createElement('div');
		this.body.classList.add("post_body");	
		this.body.classList.add("post_body--normal");	
		this.body.setAttribute("contenteditable", "");
		this.element.appendChild(this.body);
	}

	Post.prototype.createHeader = function () {		
		var self = this;
		this.header = document.createElement('div');
		this.header.classList.add("post_header");
		this.header.toggle = document.createElement('span');
		this.header.toggle.innerHTML = '  + ';
		this.header.content = document.createElement('span');
		this.header.del = document.createElement('button');
		this.header.del.innerHTML = "Delete"; 
		this.header.del.classList.add('delete');
		this.header.appendChild(this.header.toggle);
		this.header.appendChild(this.header.content);		
		this.header.appendChild(this.header.del);
		this.element.appendChild(this.header);		
	}

	Post.prototype.initListeners = function () {
		var self = this;

		this.body.addEventListener("focus", function (e) {
			this.classList.remove("post_body--normal")
			this.classList.add("post_body--focus");
		});

		this.body.addEventListener("blur", function (e) {
			this.classList.add("post_body--normal")
			this.classList.remove("post_body--focus");
			self.sendChanges();
		});		

		this.header.del.addEventListener("click", function (e) {
			xhrUtils.deleteRecord(self.id, "posts", function () {
				self.destroy();
			}, xhrUtils.failedRequest);
		});
	}

	Post.prototype.renderContent = function () {
		this.body.innerHTML = this.content.body;
		this.header.content.innerHTML = this.content.postname;
	}

	Post.prototype.sendChanges = function () {		
		this.content.body = this.body.innerHTML;
		xhrUtils.update(this.content, this.id, 'posts', this.onUpdate.bind(this));
	}

	Post.prototype.onUpdate = function () {
		var self = this;
		this.body.classList.add("post_body--update");
		setTimeout(function () {
			self.body.classList.remove("post_body--update");
		}, 3000);
	}

	Post.prototype.destroy = function () {
		this.element.remove();
	}


	Post.prototype.addComments = function () {
		var self = this;
		this.commentBlock = document.createElement('div');		
		this.element.appendChild(this.commentBlock);
		if (this.comments) {		
			this.comments.forEach(function(comment) {
				comment.el = new App.blog.Comment(comment, self.commentBlock);
			});
		}
	}

	Post.prototype.newComentBlock = function () {
		var input = document.createElement('input');
		var create = document.createElement('button');
		var wrap = document.createElement('div');
		var self = this;
		input.type = "text";
		create.innerHTML = "Add Comment";		
		wrap.appendChild(input);
		wrap.appendChild(create);
		this.element.appendChild(wrap);
		create.addEventListener('click', function () {
			xhrUtils.create({postId: self.id, body: input.value}, "comments", function (data) {		
				data.el = new App.blog.Comment(data, self.commentBlock);		
				self.comments.push(data);
			}, xhrUtils.failedRequest);
		});
	}

	return Post;
})();