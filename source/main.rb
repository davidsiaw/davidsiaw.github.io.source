require 'active_support/core_ext/date_time'

def create_page(inf:, path:, title:, &block)

  sidenav_page path, title, theme: :dark do

    request_js 'js/highlight.min.js'
    request_css 'css/dracula.css'
    request_css 'css/ourown.css'

    brand 'Home'

    menu do

      inf[:categories].each do |k, v|
        nav k, :'folder-open', "/categories/#{k}"
      end

      nav 'History', :calendar, '' do
        inf[:history].each do |k, v|
          nav "#{k} (#{v.length})", :'calendar-minus-o', "/#{k}/"
        end
      end

      nav 'Tags', :tags, '' do
        inf[:tags].each do |k, v|
          nav "#{k} (#{v.length})", :tag, "/tags/#{k}/"
        end
      end

    end

    instance_eval(&block)

    row do
      col 12 do
        hr
        br
        br

        text <<~TEXT
<script type="text/javascript" id="MathJax-script" async
  src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js">
</script>
        TEXT

        on_page_load <<~TEXT
          hljs.highlightAll();
        TEXT
      end
    end

  end


end

def post_collection_page(inf, posts, &block)

  mainpages = posts.each_slice(5).to_a

  mainpages.each_with_index do |postblok, i|
    postblok.each do |x|

      info = yield(i)

      create_page inf: inf, path: info[:path], title: info[:title] do

        header do
          col 12 do
            h2 info[:header]
          end
        end

        postblok.each do |post|

          row do
            col 12 do
              h1 do
                a post.title, href:"/#{post.page_path}"
              end

              h6 post.date.to_formatted_s(:long)

              text post.short_content

              a "Read post", href:"/#{post.page_path}"


              hr
            end
          end


        end

        row do
          col 12 do
            if i != 0
              a "<< previous" , href: "/#{yield(i-1)[:path]}"
            end

            if mainpages[i+1]
              a "next >>", href: "/#{yield(i+1)[:path]}", style: 'float: right;'
            end
          end
        end

      end
    end
  end

end