export default function($target) {
	$(document)
		.mousemove(function(e) {
			if (!!this.move) {
				var $target = $(this.move_target);
				var maxTop =
					document.documentElement.clientHeight -
					$target.outerHeight();
				var maxLeft =
					document.documentElement.clientWidth - $target.outerWidth();
				var posix = !document.move_target
						? { x: 0, y: 0 }
						: document.move_target.posix,
					callback =
						document.call_down ||
						function() {
							var top = e.clientY - posix.y;
							var left = e.clientX - posix.x;
							if (
								left >= 0 &&
								left <= maxLeft &&
								top >= 0 &&
								top <= maxTop
							) {
								$(this.move_target).css({
									position: "fixed",
									top: top,
									left: left
								});
							}
						};

				callback.call(this, e, posix);
			}
		})
		.mouseup(function(e) {
			if (!!this.move) {
				var callback = document.call_up || function() {};
				callback.call(this, e);
				$.extend(this, {
					move: false,
					move_target: null,
					call_down: false,
					call_up: false
				});
			}
		});
	return {
		initDrag() {
			$target.mousedown(function(e) {
				var offset = $(this).offset();

				this.posix = {
					x: e.pageX - offset.left,
					y: e.pageY - offset.top
				};
				$.extend(document, { move: true, move_target: this });
			});
			$target.css({
				cursor: "pointer"
			});
		},
		destroyDrag() {
			$target.unbind("mousedown");
		}
	};
}
