<html>

<head>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta charset="utf-8">
  <link rel="stylesheet" href="css/all.css">
  <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
  <!--[if lte IE 9]>
    <style>
    </style>
  <![endif]-->
  <title>Page: {{ page }}</title>
</head>

<body>
  <header>
    {% include "../partials/header.swig" %}
  </header>

  {% block content %}{% endblock %}

  <footer>
    {% include "../partials/footer.swig" %}
  </footer>

  <script src="js/all.js"></script>
</body>

</html>
